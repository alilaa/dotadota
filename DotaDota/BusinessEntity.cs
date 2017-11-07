using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace DotaDota {
    public class BusinessEntity {

        public class HeroSoundAndImage {
            [JsonProperty("sound")]
            public string sound { get; set; }

            [JsonProperty("image")]
            public string image { get; set; }

            public HeroSoundAndImage(string sound, string image) {
                this.sound = sound;
                this.image = image;
            }
        }

        public class PlayerHeroPool {
            [JsonProperty("heroPool")]
            public List<Heroes.Hero> HeroPool;
            [JsonProperty("selectedHeroId")]
            public int SelectedHeroId { get; set; }

            public PlayerHeroPool(List<Heroes.Hero> heroes) {
                this.HeroPool = heroes;
            }
            public override string ToString() {
                StringBuilder stringBuilder = new StringBuilder();
                //stringBuilder.AppendLine(string.Format("Hero Pool:{0}", string.Join(",", this.HeroPool)));
                this.HeroPool.ForEach(h => stringBuilder.AppendFormat("{0}({1})", h.name, h.id==SelectedHeroId?"selected":""));
                return stringBuilder.ToString();
            }
        }
        public class Draft {
            [JsonProperty("playerHeroPoolDict")]
            public Dictionary<Guid, PlayerHeroPool> PlayerHeroPoolDict { get; private set; }
            public Guid id { get; private set; }
            [JsonProperty("teams")]
            public List<Team> Teams { get; private set; }
            [JsonProperty("allPlayers")]
            public List<Player> AllPlayers { get; private set; }
            public Draft(List<Team> teams, List<Player> allPlayers) {
                this.AllPlayers = allPlayers;
                this.Teams = teams;
                this.id = Guid.NewGuid();
                this.PlayerHeroPoolDict = new Dictionary<Guid, PlayerHeroPool>();
            }

            public List<Player> GetPlayers() {
                return this.Teams.SelectMany(t => t.Players).ToList();
            }
            public List<Player> GetPlayers(Faction faction) {
                return this.Teams.FirstOrDefault(t => t.Faction == faction)?.Players;
            }

            public void GenerateHeroPools(int poolSize) {
                Random rnd = new Random();
                Dictionary<Guid,PlayerHeroPool> newPoolDict = new Dictionary<Guid, PlayerHeroPool>();
                var allHeroes = DotaDotaEngine.AllHeroes;
                var usedHeroes = new List<Heroes.Hero>();
                //Death Pophet, bloodseeker and silencer are banned in 10v10
                if(GetPlayers().Count > 10) { 
                    usedHeroes.AddRange(allHeroes.Where(hero => hero.id == 43 || hero.id == 4 || hero.id == 75));
                }
                foreach (var player in GetPlayers()) {
                    var heroPool = poolSize > 2 ? HeroPoolLarge(poolSize, allHeroes, usedHeroes, rnd) : HeroPoolSmall(poolSize, allHeroes, usedHeroes, rnd);
                    usedHeroes.AddRange(heroPool);
                    newPoolDict.Add(player.id, new PlayerHeroPool(heroPool.ToList()));
                }
                    this.PlayerHeroPoolDict = newPoolDict;
            }

            private static List<Heroes.Hero> HeroPoolLarge(int poolSize, List<Heroes.Hero> allHeroes, List<Heroes.Hero> usedHeroes, Random rnd) {
                //We need to first make sure we get 1 int, srt & agi. Then we take randomly.
                var heroPool =
                    new List<Heroes.Hero> {
                        allHeroes.Except(usedHeroes)
                                 .OrderBy(x => rnd.Next())
                                 .SkipWhile(h => h.primaryAttribute != Attribute.Strength)
                                 .Take(1)
                                 .First(),
                        allHeroes.Except(usedHeroes)
                                 .OrderBy(x => rnd.Next())
                                 .SkipWhile(h => h.primaryAttribute != Attribute.Agility)
                                 .Take(1)
                                 .First(),
                        allHeroes.Except(usedHeroes)
                                 .OrderBy(x => rnd.Next())
                                 .SkipWhile(h => h.primaryAttribute != Attribute.Intellect)
                                 .Take(1)
                                 .First()
                    };
                heroPool.AddRange(allHeroes.Except(usedHeroes.Concat(heroPool)).OrderBy(x => rnd.Next()).Take(poolSize - 3).ToList());
                return heroPool;
            }

            private static List<Heroes.Hero> HeroPoolSmall(int poolSize, List<Heroes.Hero> allHeroes, List<Heroes.Hero> usedHeroes, Random rnd) {
                List<Heroes.Hero> heroPool = allHeroes.Except(usedHeroes)
                                 .OrderBy(x => rnd.Next()).Take(poolSize).ToList();
                return heroPool;
            }

            public void GenerateSitOut(int noOfSitOut) {
                Random rnd = new Random();
                int currentFaction = 0;

                for (int i = 0; i < noOfSitOut; i++) {
                    var sitOutGuid =
                    GetPlayers((Faction)Enum.GetValues(typeof(Faction)).GetValue(currentFaction)).OrderBy(p => p.SitOutCount).ThenBy(x => rnd.Next()).Take(1).First().id;
                    // ensure next sitout is from other faction
                    currentFaction = currentFaction == 1 ? 0 : 1;
                    // set the player to sitout
                    this.PlayerHeroPoolDict[sitOutGuid].HeroPool = new List<Heroes.Hero> { new Heroes.Hero().IceFrog(), new Heroes.Hero().IceFrog(), new Heroes.Hero().IceFrog() };
                    //update sit out record
                    GetPlayers().First(p => p.id == sitOutGuid).SitOutCount++;
                    //DotaDotaEngine.AllPlayers.First(p => p.id == sitOutGuid).SitOutCount++;
                }
            }

            public override string ToString() {
                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.AppendLine(string.Format("Draft (id:{0}): <br>", this.id));
                stringBuilder.AppendLine(string.Format("Dire (id:{0}): <br>", this.Teams.First(t => t.Faction == Faction.Dire).id));
                Teams.First(t => t.Faction == Faction.Dire).Players
                    .ForEach(p => stringBuilder.AppendLine(string.Format("PlayerName:{0}(id:{1}), HeroPool:{2} <br>", p.Name, p.id, PlayerHeroPoolDict[p.id].ToString())));
                stringBuilder.AppendLine(string.Format("Radiant (id:{0}): <br>", this.Teams.First(t => t.Faction == Faction.Radiant).id));
                Teams.First(t => t.Faction == Faction.Radiant).Players
                    .ForEach(p => stringBuilder.AppendLine(string.Format("PlayerName:{0}(id:{1}), HeroPool:{2} <br>", p.Name, p.id, PlayerHeroPoolDict[p.id].ToString())));
                return stringBuilder.ToString();
            }
        }

        public class Player {
            public Guid id { get; private set; }
            [JsonProperty("name")]
            public string Name { get; set; }
            public Player(string name) {
                this.Name = name;
                this.id = Guid.NewGuid();
                this.SitOutCount = 0;
            }
            [JsonProperty("sitOutCount")]
            public int SitOutCount { get; set; }
        }

        public class Team {
            public Guid id { get; private set; }
            [JsonProperty("faction")]
            public Faction Faction { get; private set; }
            [JsonProperty("players")]
            public List<Player> Players { get; set; }
            public Team(List<Player> players, Faction faction) {
                this.Players = players;
                this.id = Guid.NewGuid();
                this.Faction = faction;
            }
        }

        public enum Faction {
            Radiant = 0,
            Dire = 1
        }

        public class Attribute {
            public static string Agility = "agility";
            public static string Strength = "strength";
            public static string Intellect = "intellect";
        }
    }
}