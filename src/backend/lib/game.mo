import Types "../types/game";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";

module {
  public type GameState = Types.GameState;
  public type Cargo = Types.Cargo;
  public type Score = Types.Score;
  public type DeliveryRecord = Types.DeliveryRecord;
  public type LeaderboardEntry = Types.LeaderboardEntry;
  public type GamePhase = Types.GamePhase;
  public type CargoStatus = Types.CargoStatus;
  public type GameId = Types.GameId;
  public type Timestamp = Types.Timestamp;
  public type UserId = Types.UserId;

  public func startDelivery(player : UserId, cargo : Cargo, startTime : Timestamp, gameId : GameId) : GameState {
    {
      id = gameId;
      player = player;
      phase = #preparing;
      cargo = cargo;
      startTime = startTime;
      endTime = null;
      distanceRemaining = 1000;
      speed = 0;
      altitude = 0;
    };
  };

  public func updateGameState(state : GameState, currentTime : Timestamp, speed : Nat, altitude : Nat, distanceRemaining : Nat) : GameState {
    let elapsed = if (currentTime > state.startTime) { currentTime - state.startTime } else { 0 };
    let freshness = calculateFreshness(state.cargo, elapsed);
    let newStatus = if (freshness > 70) {
      #fresh;
    } else if (freshness > 30) {
      #spoiling;
    } else {
      #spoiled;
    };
    let newCargo = { state.cargo with status = newStatus };
    let newPhase = if (distanceRemaining == 0) {
      #delivered;
    } else if (altitude > 0 and speed > 0) {
      #flying;
    } else if (altitude > 0 and speed == 0) {
      #landing;
    } else if (altitude == 0 and speed > 0) {
      #takingOff;
    } else {
      #preparing;
    };
    { state with phase = newPhase; cargo = newCargo; speed = speed; altitude = altitude; distanceRemaining = distanceRemaining };
  };

  public func calculateFreshness(cargo : Cargo, elapsedSeconds : Nat) : Nat {
    let spoilage = cargo.perishabilityRate * elapsedSeconds;
    if (spoilage >= 100) { 0 } else { 100 - spoilage };
  };

  public func calculateScore(deliveryTime : Nat, freshnessPercent : Nat, landed : Bool) : Nat {
    let freshnessBonus = freshnessPercent * 10;
    let speedBonus = if (deliveryTime < 60) { 500 } else if (deliveryTime < 120) { 300 } else if (deliveryTime < 180) { 100 } else { 0 };
    let landingBonus = if (landed) { 200 } else { 0 };
    freshnessBonus + speedBonus + landingBonus;
  };

  public func createDeliveryRecord(gameId : GameId, player : UserId, cargoName : Text, deliveryTime : Nat, freshnessPercent : Nat, score : Nat, landed : Bool, timestamp : Timestamp) : DeliveryRecord {
    {
      gameId = gameId;
      player = player;
      cargoName = cargoName;
      deliveryTime = deliveryTime;
      freshnessPercent = freshnessPercent;
      score = score;
      landedAtMogadishu = landed;
      timestamp = timestamp;
    };
  };

  public func buildLeaderboard(records : [DeliveryRecord]) : [LeaderboardEntry] {
    let grouped = records.foldLeft(
      Map.empty<UserId, { totalScore : Nat; bestTime : Nat; count : Nat }>(),
      func(acc, record) {
        let existing = acc.get(record.player);
        switch (existing) {
          case (?entry) {
            let newBestTime = if (record.deliveryTime < entry.bestTime) { record.deliveryTime } else { entry.bestTime };
            acc.add(record.player, { totalScore = entry.totalScore + record.score; bestTime = newBestTime; count = entry.count + 1 });
          };
          case (null) {
            acc.add(record.player, { totalScore = record.score; bestTime = record.deliveryTime; count = 1 });
          };
        };
        acc;
      }
    );
    let entries = Array.fromIter(
      grouped.entries().map(
        func((player, data)) {
          { rank = 0; player = player; totalScore = data.totalScore; bestDeliveryTime = data.bestTime; deliveriesCount = data.count };
        }
      )
    );
    let sorted = entries.sort(
      func(a, b) { Nat.compare(b.totalScore, a.totalScore) }
    );
    sorted.map<LeaderboardEntry, LeaderboardEntry>(
      func(entry) { { entry with rank = 0 } }
    );
  };
};
