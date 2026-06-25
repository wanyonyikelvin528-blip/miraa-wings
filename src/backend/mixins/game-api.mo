import Types "../types/game";
import GameLib "../lib/game";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  activeGames : Map.Map<Types.GameId, Types.GameState>,
  deliveryRecords : List.List<Types.DeliveryRecord>,
  nextGameId : { var value : Nat },
) {
  public shared ({ caller }) func startDelivery(cargo : Types.Cargo) : async Types.GameState {
    let gameId = nextGameId.value;
    nextGameId.value += 1;
    let now = Time.now() : Int;
    let startTime = if (now > 0) { now.toNat() } else { 0 };
    let state = GameLib.startDelivery(caller, cargo, startTime, gameId);
    activeGames.add(gameId, state);
    state;
  };

  public shared ({ caller }) func updateGameState(gameId : Types.GameId, speed : Nat, altitude : Nat, distanceRemaining : Nat) : async ?Types.GameState {
    ignore caller;
    switch (activeGames.get(gameId)) {
      case (?existing) {
        let now = Time.now() : Int;
        let currentTime = if (now > 0) { now.toNat() } else { 0 };
        let updated = GameLib.updateGameState(existing, currentTime, speed, altitude, distanceRemaining);
        activeGames.add(gameId, updated);
        ?updated;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func submitScore(gameId : Types.GameId, landedAtMogadishu : Bool) : async ?Types.Score {
    switch (activeGames.get(gameId)) {
      case (?state) {
        if (state.player != caller) { return null };
        let now = Time.now() : Int;
        let endTime = if (now > 0) { now.toNat() } else { 0 };
        let deliveryTime = if (endTime > state.startTime) { endTime - state.startTime } else { 0 };
        let freshnessPercent = GameLib.calculateFreshness(state.cargo, deliveryTime);
        let totalScore = GameLib.calculateScore(deliveryTime, freshnessPercent, landedAtMogadishu);
        let record = GameLib.createDeliveryRecord(
          gameId,
          caller,
          state.cargo.name,
          deliveryTime,
          freshnessPercent,
          totalScore,
          landedAtMogadishu,
          endTime,
        );
        deliveryRecords.add(record);
        let score : Types.Score = {
          gameId = gameId;
          player = caller;
          deliveryTime = deliveryTime;
          freshnessPercent = freshnessPercent;
          totalScore = totalScore;
          timestamp = endTime;
        };
        ?score;
      };
      case (null) { null };
    };
  };

  public query func getLeaderboard(limit : Nat) : async [Types.LeaderboardEntry] {
    let records = deliveryRecords.toArray();
    let leaderboard = GameLib.buildLeaderboard(records);
    if (leaderboard.size() <= limit) {
      leaderboard;
    } else {
      leaderboard.sliceToArray<Types.LeaderboardEntry>(0, limit);
    };
  };

  public query func getDeliveryHistory(player : Types.UserId, limit : Nat) : async [Types.DeliveryRecord] {
    let all = deliveryRecords.toArray();
    let filtered = all.filter(
      func(record) { record.player == player },
    );
    let sorted = filtered.sort(
      func(a, b) { Nat.compare(b.timestamp, a.timestamp) },
    );
    if (sorted.size() <= limit) {
      sorted;
    } else {
      sorted.sliceToArray<Types.DeliveryRecord>(0, limit);
    };
  };

  public query func getGameState(gameId : Types.GameId) : async ?Types.GameState {
    activeGames.get(gameId);
  };
};
