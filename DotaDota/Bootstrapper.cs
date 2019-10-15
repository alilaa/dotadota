using System.Collections.Generic;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace DotaDota {
    public class Bootstrapper : DefaultNancyBootstrapper {
        // The bootstrapper enables you to reconfigure the composition of the framework,
        // by overriding the various methods and properties.
        // For more information https://github.com/NancyFx/Nancy/wiki/Bootstrapper

        //ensure we have the instance.
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines) {
#if DEBUG
            StaticConfiguration.EnableRequestTracing = true;
#endif
            // Add base class setup
            base.ApplicationStartup(container, pipelines);

            DotaDotaEngine.Initialize();
        }

    }
}