using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using Newtonsoft.Json;

namespace DotaDota {
    public sealed class Heroes {

        private string getHeroesUrl = "https://api.opendota.com/api/heroes";
        [JsonProperty("allHeroes")]
        public List<Hero> AllHeroes { get; private set; }

        static readonly Heroes instance = new Heroes();

        private Heroes() {
            AllHeroes = FetchHeroData();
        }
        [JsonProperty("instance")]
        public static Heroes Instance {
            get { return instance; }
        }

        public class Roles {
            public int carry { get; set; }
            public int escape { get; set; }
            public int nuker { get; set; }
            public int? initiator { get; set; }
            public int? durable { get; set; }
            public int? disabler { get; set; }
            public int? jungler { get; set; }
            public int? support { get; set; }
            public int? pusher { get; set; }
        }

        public class PlayerViewModel {
            public string Faction { get; set; }
            public BusinessEntity.Player CurrentPlayer { get; set; }
            public List<BusinessEntity.Player> OtherPlayers { get; set; }

        }

        public class Hero {
            public Hero IceFrog() {
                this.id = 9999999;
                this.code = "npc_dota_hero_iceFrog";
                this.name = "iceFrog";
                this.url = "https://pbs.twimg.com/profile_images/564809427795337216/apRA_tpJ.jpeg";
                return this;
            }
            public int id { get; set; }
            public string code { get; set; }
            public string name { get; set; }

            //[JsonIgnore]
            //[JsonProperty(Required = Required.Default)]
            [JsonProperty("shortCode")]
            public string shortCode {
                get {
                    return this.code.Replace("npc_dota_hero_", "");
                }
            }

            //[JsonIgnore]
            //[JsonProperty(Required = Required.Default)]
            [JsonProperty("selected")]
            public bool Selected { get; set; }
            public List<object> aliases { get; set; }
            public string team { get; set; }
            public Roles roles { get; set; }
            public string primaryAttribute { get; set; }
            public string attack { get; set; }
            public int attackRate { get; set; }
            public int attackRange { get; set; }
            public int projectileSpeed { get; set; }
            public int movementSpeed { get; set; }
            public double movementTurnRate { get; set; }
            public bool cmEnabled { get; set; }
            public int complexity { get; set; }
            public string url { get; set; }
            public string spawn { get; set; }
        }



        private List<Hero> FetchHeroData() {
            // Create an HttpClient instance 
            List<Hero> deserializedheroes = new List<Hero>();
            HttpClient client = new HttpClient();
            try {

            
            // Send a request asynchronously continue when complete 
            client.GetAsync(this.getHeroesUrl).ContinueWith(
                (requestTask) => {
                    // Get HTTP response from completed task. 
                    HttpResponseMessage response = requestTask.Result;

                    // Check that response was successful or throw exception 
                    response.EnsureSuccessStatusCode();
                        
                    // Read response asynchronously as JsonValue
                    var jsonstring = response.Content.ReadAsStringAsync();
                    jsonstring.Wait();
                    deserializedheroes = JsonConvert.DeserializeObject<List<Hero>>(jsonstring.Result);
                });
            }
            catch (Exception e) {
                Console.WriteLine(e);
                throw;
            }
            return deserializedheroes;
        }
    }
}