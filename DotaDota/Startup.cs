using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using Microsoft.AspNet.SignalR;
using Nancy.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DotaDota {
    using Owin;
    public class FilteredCamelCasePropertyNamesContractResolver : DefaultContractResolver {
        public FilteredCamelCasePropertyNamesContractResolver() {
            AssembliesToInclude = new HashSet<Assembly>();
            TypesToInclude = new HashSet<Type>();
        }
        // Identifies assemblies to include in camel-casing
        public HashSet<Assembly> AssembliesToInclude { get; set; }
        // Identifies types to include in camel-casing
        public HashSet<Type> TypesToInclude { get; set; }
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization) {
            var jsonProperty = base.CreateProperty(member, memberSerialization);
            Type declaringType = member.DeclaringType;
            if (
                TypesToInclude.Contains(declaringType)
                || AssembliesToInclude.Contains(declaringType.Assembly)) {
                jsonProperty.PropertyName = jsonProperty.PropertyName.ToCamelCase();
            }
            return jsonProperty;
        }
    }
    public class Startup {
        private static readonly Lazy<JsonSerializer> JsonSerializerFactory = new Lazy<JsonSerializer>(GetJsonSerializer);
        private static JsonSerializer GetJsonSerializer() {
            return new JsonSerializer {
                ContractResolver = new FilteredCamelCasePropertyNamesContractResolver {
                    // 1) Register all types in specified assemblies:
                    AssembliesToInclude =
                    {
                     typeof (DotaDotaEngine).Assembly,
                     typeof (BusinessEntity).Assembly,
                     typeof (Heroes).Assembly,
                 },
                    //2) Register individual types:
                    TypesToInclude =
                                    {
                                        typeof(BusinessEntity.Draft),
                                        typeof(BusinessEntity.Player),
                                        typeof(BusinessEntity.PlayerHeroPool),
                                        typeof(BusinessEntity.Faction),
                                        typeof(BusinessEntity.Team),
                                    }
                }
            };
        }
        public void Configuration(IAppBuilder app) {
            app
                .MapSignalR()
                .UseNancy();
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer),() => JsonSerializerFactory.Value);
        }
    }
}