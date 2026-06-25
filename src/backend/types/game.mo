import Common "common";

module {
  public type GameId = Common.GameId;
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;

  public type CargoStatus = {
    #fresh;
    #spoiling;
    #spoiled;
  };

  public type Cargo = {
    id : Nat;
    name : Text;
    totalWeight : Nat;
    perishabilityRate : Nat; // spoilage units per second
    status : CargoStatus;
  };

  public type GamePhase = {
    #preparing;
    #takingOff;
    #flying;
    #landing;
    #delivered;
  };

  public type GameState = {
    id : GameId;
    player : UserId;
    phase : GamePhase;
    cargo : Cargo;
    startTime : Timestamp;
    endTime : ?Timestamp;
    distanceRemaining : Nat;
    speed : Nat;
    altitude : Nat;
  };

  public type Score = {
    gameId : GameId;
    player : UserId;
    deliveryTime : Nat; // seconds
    freshnessPercent : Nat; // 0-100
    totalScore : Nat;
    timestamp : Timestamp;
  };

  public type DeliveryRecord = {
    gameId : GameId;
    player : UserId;
    cargoName : Text;
    deliveryTime : Nat;
    freshnessPercent : Nat;
    score : Nat;
    landedAtMogadishu : Bool;
    timestamp : Timestamp;
  };

  public type LeaderboardEntry = {
    rank : Nat;
    player : UserId;
    totalScore : Nat;
    bestDeliveryTime : Nat;
    deliveriesCount : Nat;
  };
};
