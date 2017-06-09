using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using Microsoft.AspNet.SignalR;
using DotaDota.Modules;
using Newtonsoft.Json;

namespace DotaDota {
    public class DotaDotaEngine {
        private string getHeroesUrl = "https://raw.githubusercontent.com/zaerl/dota2-info/master/lib/heroes.json";
        private static DotaDotaEngine engine;
        public static List<Heroes.Hero> AllHeroes;
        public static BusinessEntity.Draft LatestDraft;
        public static List<BusinessEntity.Player> AllPlayers = new List<BusinessEntity.Player>();
        public static List<BusinessEntity.Player> CurrentPlayers;
        public static IHubContext broadcastHub;
        public static bool IsInitialized { get; private set; }

        public static void Initialize() {
            if (engine != null) {
                return;
            }
            for (int i = 1; i <= 30; i++) {
                AllPlayers.Add(new BusinessEntity.Player("Player" + i));
            }
            engine = new DotaDotaEngine();
            engine.FetchHeroData();
            broadcastHub = GlobalHost.ConnectionManager.GetHubContext<MyHub1>();
        }

        private void FetchHeroData() {
            //Populate heroes from file first. Update from api if possible later.
            //using (StreamReader r = new StreamReader(HttpContext.Current.Server.MapPath("bin/heroes.json"))) {
            //    string json = r.ReadToEnd();
            //    var heroes = JsonConvert.DeserializeObject<List<Heroes.Hero>>(json);
            //    DotaDotaEngine.AllHeroes = heroes;
            //}
            // Create an HttpClient instance 
            List<Heroes.Hero> deserializedheroes = new List<Heroes.Hero>();
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
                        deserializedheroes = JsonConvert.DeserializeObject<List<Heroes.Hero>>(jsonstring.Result);
                        DotaDotaEngine.AllHeroes = deserializedheroes;
                    });
            }
            catch (Exception e) {
                Console.WriteLine(e);
                throw;
            }
        }

        public static string CreateRandomDraft(int noOfPlayers, int poolSize, int noOfSitOut = 0) {
            if (AllHeroes == null) {
                return string.Empty;
            }
            ClearAllPlayerHeroSelected();
            BusinessEntity.Draft draft;
            List<BusinessEntity.Player> currentPlayers = new List<BusinessEntity.Player>();
            
            for (int i = 1; i <= noOfPlayers; i++) {
                currentPlayers.Add(AllPlayers[i-1]);
            }
            draft = new BusinessEntity.Draft(new List<BusinessEntity.Team>() {new BusinessEntity.Team(currentPlayers.Take(noOfPlayers/2).ToList(),BusinessEntity.Faction.Dire), new BusinessEntity.Team(currentPlayers.Skip(noOfPlayers/2).Take(noOfPlayers/2).ToList(), BusinessEntity.Faction.Radiant)}, AllPlayers);
            draft.GenerateHeroPools(poolSize);
            draft.GenerateSitOut(noOfSitOut);
            LatestDraft = draft;
            CurrentPlayers = currentPlayers;
            return draft.ToString();
        }

        public static BusinessEntity.PlayerHeroPool GetPlayerHeroPool(Guid guid) {
            var playerHeroPool = LatestDraft.PlayerHeroPoolDict[guid];
            return playerHeroPool;
        }

        public static void SetPlayerHeroSelected(Guid playerGuid, int heroSelected) {
            LatestDraft.PlayerHeroPoolDict[playerGuid].HeroPool.ForEach(h => h.Selected = false);
            LatestDraft.PlayerHeroPoolDict[playerGuid].HeroPool.First(h => h.id==heroSelected).Selected = true;
        }

        public static void ClearAllPlayerHeroSelected() {
            if (LatestDraft != null) {
                LatestDraft.PlayerHeroPoolDict.Values.ToList().ForEach(h => h.HeroPool.ForEach(hero => hero.Selected = false));
            }
        }

        public static void SetPlayerHeroPicked(Guid playerGuid) {
            //LatestDraft.PlayerHeroPoolDict[playerGuid].HeroPool.ForEach(h => h.Selected = false);
            var selectedId = LatestDraft.PlayerHeroPoolDict[playerGuid].HeroPool.First(h => h.Selected).id;
            LatestDraft.PlayerHeroPoolDict[playerGuid].SelectedHeroId = selectedId;
        }

        public static void UpdatePlayerName(Guid playerGuid, string newName) {
            BusinessEntity.Player player = LatestDraft.GetPlayers().FirstOrDefault(p => p.id == playerGuid);
            if (player != null) {
                player.Name = newName;
            }
        }

        public static void UpdatePlayerSitOut(Guid playerGuid, int newSitOut) {
            BusinessEntity.Player player = LatestDraft.GetPlayers().FirstOrDefault(p => p.id == playerGuid);
            if (player != null) {
                player.SitOutCount = newSitOut;
            }
        }

        public static void ClearAllPlayerSitOut() {
            LatestDraft.GetPlayers().ForEach(p => p.SitOutCount = 0);
        }

        public static void CreateRandomNewTeams() {
            Random rnd = new Random();
            ClearAllPlayerHeroSelected();
            var allPlayers = DotaDotaEngine.CurrentPlayers;
            var usedPlayers = new List<BusinessEntity.Player>();

            var team1 = allPlayers.Except(usedPlayers).OrderBy(x => rnd.Next()).Take(allPlayers.Count / 2).ToList();
            usedPlayers.AddRange(team1);
            var team2 = allPlayers.Except(usedPlayers).OrderBy(x => rnd.Next()).Take(allPlayers.Count / 2).ToList();
            DotaDotaEngine.LatestDraft.Teams[0].Players = team1;
            DotaDotaEngine.LatestDraft.Teams[1].Players = team2;
        }

        public static void CreateRandomNewDraft() {
            ClearAllPlayerHeroSelected();
            LatestDraft.GenerateHeroPools(3);
            LatestDraft.GenerateSitOut(2);
        }
    }
}