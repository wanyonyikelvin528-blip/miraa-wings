import Map "mo:core/Map";
import List "mo:core/List";

module {
  type GamePhase = {
    #preparing;
    #takingOff;
    #flying;
    #landing;
    #delivered;
  };

  type CargoStatus = {
    #fresh;
    #spoiling;
    #spoiled;
  };

  type GameState = {
    id : Nat;
    player : Principal;
    phase : GamePhase;
    cargo : {
      id : Nat;
      name : Text;
      totalWeight : Nat;
      perishabilityRate : Nat;
      status : CargoStatus;
    };
    startTime : Nat;
    endTime : ?Nat;
    distanceRemaining : Nat;
    speed : Nat;
    altitude : Nat;
  };

  type DeliveryRecord = {
    gameId : Nat;
    player : Principal;
    cargoName : Text;
    deliveryTime : Nat;
    freshnessPercent : Nat;
    score : Nat;
    landedAtMogadishu : Bool;
    timestamp : Nat;
  };

  type GameStateMap = Map.Map<Nat, GameState>;
  type DeliveryRecordList = List.List<DeliveryRecord>;

  type OldActor = {};

  type NewActor = {
    var activeGames : GameStateMap;
    var deliveryRecords : DeliveryRecordList;
    var nextGameId : { var value : Nat };
  };

  public func migration(_old : OldActor) : NewActor {
    let gameStateMap : GameStateMap = Map.empty();
    let recordsList : DeliveryRecordList = List.empty();
    let gameIdCounter = { var value = 0 };
    {
      var activeGames = gameStateMap;
      var deliveryRecords = recordsList;
      var nextGameId = gameIdCounter;
    }
  };
};
