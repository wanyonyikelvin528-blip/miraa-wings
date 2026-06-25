import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import Map "mo:core/Map";
import List "mo:core/List";
import GameTypes "types/game";
import GameMixin "mixins/game-api";

actor {
  stable var activeGames : Map.Map<GameTypes.GameId, GameTypes.GameState>;
  stable var deliveryRecords : List.List<GameTypes.DeliveryRecord>;
  stable var nextGameId : { var value : Nat };

  include MixinViews();
  include GameMixin(activeGames, deliveryRecords, nextGameId);
};
