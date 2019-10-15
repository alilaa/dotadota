using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web.UI;
using Nancy;
using Nancy.Extensions;
using Nancy.ModelBinding;
using Newtonsoft.Json;

namespace DotaDota.Modules {

    public class IndexModule : NancyModule {
        public IndexModule() {
            Get["/"] = parameters => Response.AsFile("bin/index.html", "text/html");
        }
    }

    public class PlayerModule : NancyModule {
        public PlayerModule() {
            Get["/player"] = parameters => Response.AsFile("bin/index.html", "text/html");
            Get["/admin"] = parameters => Response.AsFile("bin/index.html", "text/html");
            Get["/radiant"] = parameters => Response.AsFile("bin/index.html", "text/html");
            Get["/dire"] = parameters => Response.AsFile("bin/index.html", "text/html");
            Get["/overview"] = parameters => Response.AsFile("bin/index.html", "text/html");
        }
    }

    public class AdminModule : NancyModule {
        public AdminModule() {
            
        }
    }


    public class BundleModule : NancyModule {
        public BundleModule() {
            Get["/bundle.js"] = parameters => Response.AsFile("bin/bundle.js", "text/javascript");
        }
    }
    //resolves the deployed behaviour.
    public class BundleModule2 : NancyModule {
        public BundleModule2() {
            Get["/static/bundle.js"] = parameters => Response.AsFile("bin/bundle.js", "text/javascript");
        }
    }

    public class DraftModule : NancyModule {
        public DraftModule() {
            string s;
            s = DotaDotaEngine.LatestDraft == null ? DotaDotaEngine.CreateRandomDraft(17, 3, 1) : DotaDotaEngine.LatestDraft.ToString();
            Get["/draft"] = parameters => {
                return View["draft", s];
            };
        }
    }

    public class Draft2Module : NancyModule {
        public Draft2Module() {
            Get["/draft2"] = parameters => {
                return View["draft2", DotaDotaEngine.LatestDraft];
            };
        }
    }

    public class GetDraftModule : NancyModule {
        public GetDraftModule() {
            if (DotaDotaEngine.LatestDraft == null) {
                DotaDotaEngine.CreateRandomDraft(17,3,1);
            }
            Get["/api/GetDraft"] = parameters => {
                return Response.AsJson(DotaDotaEngine.LatestDraft);
            };
        }
    }

    public class PlayerViewModule : NancyModule {
        public PlayerViewModule() {
            Get["/Player/{guid}"] = parameters => {
                var playerHeroPool = DotaDotaEngine.GetPlayerHeroPool(Guid.Parse(parameters.guid));
                return View["PlayerView", playerHeroPool];
            };
        }
    }

    public class PlayerHeroSelectedModule : NancyModule {
        public PlayerHeroSelectedModule() {
            Get["/Player/{guid}/{heroId}"] = parameters => {
                DotaDotaEngine.SetPlayerHeroSelected(Guid.Parse(parameters.guid), parameters.heroId);
                var playerHeroPool = DotaDotaEngine.GetPlayerHeroPool(Guid.Parse(parameters.guid));
                return View["PlayerView", playerHeroPool];
            };
        }
    }

    public class PlayerHeroSelectedAPIModule : NancyModule {
        public PlayerHeroSelectedAPIModule() {
            Post["api/Player/{guid}/{heroId}"] = parameters => {
                DotaDotaEngine.SetPlayerHeroSelected(Guid.Parse(parameters.guid), parameters.heroId);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }

    public class PlayerHeroPickedAPIModule : NancyModule {
        public PlayerHeroPickedAPIModule() {
            Post["api/PlayerPicked/{guid}"] = parameters => {
                var pickedId = DotaDotaEngine.SetPlayerHeroPicked(Guid.Parse(parameters.guid));
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                try {
                    var pickedHeroSound = DotaDotaEngine.GetPickedHeroSoundAndImage(pickedId);
                    DotaDotaEngine.broadcastHub.Clients.All.heroPickCallback(pickedHeroSound);
                }
                catch (Exception) { }
                return true;
            };
        }
    }

    public class UpdatePlayerNameAPIModule : NancyModule {
        public UpdatePlayerNameAPIModule() {
            Post["api/UpdatePlayerName/{guid}/{newName}"] = parameters => {
                DotaDotaEngine.UpdatePlayerName(Guid.Parse(parameters.guid), parameters.newName);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }
    public class AddPlayerNameAPIModule : NancyModule {
        public AddPlayerNameAPIModule() {
            Post["api/AddPlayerName/{name}"] = parameters => {
                DotaDotaEngine.AddPlayerName(parameters.name);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }

    public class UpdatePlayerSitOutAPIModule : NancyModule {
        public UpdatePlayerSitOutAPIModule() {
            Post["api/UpdatePlayerSitOut/{guid}/{newCount}"] = parameters => {
                DotaDotaEngine.UpdatePlayerSitOut(Guid.Parse(parameters.guid), parameters.newCount);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }

    public class ClearAllPlayerSitOutAPIModule : NancyModule {
        public ClearAllPlayerSitOutAPIModule() {
            Post["api/ClearAllPlayerSitOut"] = parameters => {
                DotaDotaEngine.ClearAllPlayerSitOut();
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }

    public class GetAllPlayersAPIModule : NancyModule {
        public GetAllPlayersAPIModule() {
            Get["api/GetAllPlayers"] = parameters => {
                return Response.AsJson(DotaDotaEngine.AllPlayers);
            };
        }
    }

    public class APIResetModule : NancyModule {
        public APIResetModule() {
            Post["api/Reset/{draftSize}/{poolSize}/{noOfSitOut}"] = parameters => {
                var s = DotaDotaEngine.CreateRandomDraft(parameters.draftSize, parameters.poolSize, parameters.noOfSitOut);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }

    public class APIResetWithTeamsModule : NancyModule {
        public APIResetWithTeamsModule() {
            Post["api/ResetWithTeams/{poolSize}/{noOfSitOut}"] = parameters => {
                var players = this.Bind<List<string>>();
                var s = DotaDotaEngine.CreateRandomDraftWithTeam(players, parameters.poolSize, parameters.noOfSitOut);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }

    public class APINewTeamsModule : NancyModule {
        public APINewTeamsModule() {
            Post["api/NewTeams"] = parameters => {
                DotaDotaEngine.CreateRandomNewTeams();
                DotaDotaEngine.CreateRandomNewDraft(3,2);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };
        }
    }
    public class APINewDraftModule : NancyModule {
        public APINewDraftModule() {
            Post["api/NewDraft/{poolSize}/{noOfSitOut}"] = parameters => {
                DotaDotaEngine.CreateRandomNewDraft(parameters.poolSize, parameters.noOfSitOut);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.dataPump(DotaDotaEngine.LatestDraft);
                return true;
            };

        }
    }

    public class APIBanHeroModule : NancyModule {
        public APIBanHeroModule() {
            Get["api/ban/{heroId}"] = parameters => {
                DotaDotaEngine.BanHero(parameters.heroId);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.heroBanCallback(new BusinessEntity.BanState(DotaDotaEngine.BannedHeroes(), DotaDotaEngine.PickableHeroes()));
                return true;
            };

        }
    }

    public class APIUnBanHeroModule : NancyModule {
        public APIUnBanHeroModule() {
            Get["api/unban/{heroId}"] = parameters => {
                DotaDotaEngine.UnBanHero(parameters.heroId);
                //Pump the updated context to the clients with SignalR
                DotaDotaEngine.broadcastHub.Clients.All.heroBanCallback(new BusinessEntity.BanState(DotaDotaEngine.BannedHeroes(), DotaDotaEngine.PickableHeroes()));
                return true;
            };

        }
    }

    public class APIBannedHeroesModule : NancyModule {
        public APIBannedHeroesModule() {
            Get["api/bannedHeroes"] = parameters => Response.AsJson(DotaDotaEngine.BannedHeroes());

        }
    }

    public class APIPickableHeroesModule : NancyModule {
        public APIPickableHeroesModule() {
            Get["api/pickableHeroes"] = parameters => Response.AsJson(DotaDotaEngine.PickableHeroes());
        }
    }

    public class APIBanStateModule : NancyModule {
        public APIBanStateModule() {
            Get["api/banState"] = parameters => Response.AsJson(new BusinessEntity.BanState(DotaDotaEngine.BannedHeroes(), DotaDotaEngine.PickableHeroes()));
        }
    }
}