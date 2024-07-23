import { Lines } from "../components/lines";
import { Layout } from "../components/layout";
import { cn, popFlashMessage, setFlashMessage } from "../util";
import { database } from "../db";
import { newsletters } from "../db/schema";
import { Resend } from "resend";
import { env } from "../env";
import type { App } from "../server";
import { z } from "zod";
const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

export function MainPage({ flashMessage }: { flashMessage?: string }) {
  return (
    <Layout>
      <>
        <section class="relative min-h-screen gap-8 bg-gradient-to-b from-slate-900 to-slate-800 pt-12 shadow-md">
          <Lines />
          <div class="container relative z-20 mx-auto py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <a href="/" class="flex items-center gap-1 hover:text-blue-100">
                  <img
                    src="/static/wdc.jpeg"
                    width="60"
                    height="60"
                    alt="hero image"
                    class="mr-4 h-16 w-16 rounded-full"
                  />
                  <div class="flex flex-col">
                    <div class="text-xs sm:text-xl">Coming Soon...</div>
                    <div class="text-lg sm:text-3xl">WDC StarterKit</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div class="container relative z-20 mx-auto flex flex-col justify-center">
            <div class="mx-auto grid max-w-screen-xl px-4 pb-8 pt-12 lg:grid-cols-12 lg:gap-8 lg:py-24 lg:pt-16 xl:gap-0">
              <div class="col-span-7 mr-auto place-self-center">
                <h1 class="mb-6 max-w-2xl text-4xl font-semibold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
                  🚀 I&apos;m working on the{" "}
                  <span class="italic text-red-400">perfect</span> SaaS starter
                  kit.
                </h1>

                <h2 class="mb-8 text-2xl font-light">
                  This Next.js starter kit will enable you to setup your own
                  SaaS product with monthly subscriptions, including a complete
                  walkthrough on how to set it all up and maintain it.
                </h2>

                <p class="mb-4 text-3xl">Get Notified When I Launch 🚀</p>

                <form action="/" method="POST" class="flex gap-2">
                  <label class="sr-only" htmlFor="email" />
                  <input
                    required
                    type="email"
                    name="email"
                    class={cn(
                      "text w-full max-w-[320px] rounded bg-slate-100 px-2 py-2 text-slate-900 placeholder-slate-600",
                      {
                        "border-2 border-red-500": !!flashMessage,
                      },
                    )}
                    id="email"
                    placeholder="Enter your email address"
                  />
                  <button class="flex items-center justify-center gap-2 rounded bg-slate-100 px-3 text-black hover:bg-slate-300">
                    Subscribe
                  </button>
                </form>

                {flashMessage && (
                  <div class="mb-4 text-red-500">{flashMessage}</div>
                )}
              </div>

              <div class="col-span-1"></div>

              <div class="col-span-4 w-full">
                <img
                  class="hidden w-full rounded-xl shadow-xl md:block"
                  width="300"
                  height="200"
                  src="/static/computer.jpeg"
                  alt="hero image"
                />
              </div>
            </div>
          </div>
        </section>

        <section class="relative border-b border-t border-slate-400 bg-paper bg-repeat py-12 shadow-sm dark:border-slate-500 dark:bg-gray-950 dark:bg-plus">
          <div class="container mx-auto max-w-4xl pt-12 dark:text-gray-200">
            <h2 class="mb-8 text-5xl font-bold">What I&apos;m working on 🛠️</h2>

            <p class="mb-6 text-xl leading-10">
              For those who watch my channel, you know I work on lot of
              different side projects. I&apos;ve even lost track how many times
              I&apos;ve reinstalled the same ShadCN components. To speed up my
              personal time to launch new products, I&apos;m building a complete
              starter kit which includes most of everything you&apos;d need when
              creating a new online SaaS product.
            </p>

            <p class="mb-8 text-xl leading-10">
              Buckle up, it&apos;s going to be BIG; I plan to include:
            </p>

            <ul class="mb-12 grid grid-cols-2 gap-4 md:mx-12 md:grid-cols-3">
              <li>🚦 Next.js 14</li>
              <li>📦 DrizzleORM</li>
              <li>🌑 ShadCN</li>
              <li>🌈 Tailwind CSS</li>
              <li>📝 Typescript</li>
              <li>🔒 Authentication (Next-Auth) </li>
              <li>🌐 Google & Github Login </li>
              <li>🔗 Magic Link Login </li>
              <li>👥 Role Based Authorization </li>
              <li>🗄️ File Storage (R2) </li>
              <li>🛡️ DDoS Protection </li>
              <li>🌐 Hosting Walkthrough </li>
              <li>🌟 Postgres</li>
              <li>💳 Stripe Subscriptions </li>
              <li>📚 Documentation </li>
              <li>📰 Newsletter </li>
              <li>⏳ Coming Soon Mode</li>
              <li>🚧 Maintenance Mode</li>
              <li>📧 Emailing (Resend) </li>
              <li>📊 Analytics (Posthog) </li>
              <li>🚀 And More!</li>
            </ul>

            <p class="mb-6 text-xl leading-10">
              Additionally, I&apos;m working on a complete walkthrough on how to
              setup the project including any third party services, hosting, and
              how to run migrations and add new features, etc.
            </p>

            <p class="mb-24 mt-24 text-center text-xl leading-10">
              I don&apos;t want to sell you code. I want to{" "}
              <strong>teach you</strong> how to build, launch, and iterate on
              your product. I&apos;m excited to help you build!
            </p>
          </div>
        </section>
      </>
    </Layout>
  );
}

export function registerLanding(app: App) {
  app.get("/", (c) => {
    const flashMessage = popFlashMessage(c);
    return c.html(<MainPage flashMessage={flashMessage} />);
  });

  app.post("/", async (c) => {
    const body = await c.req.formData();
    const email = body.get("email") as string;

    const { success } = z.string().email().safeParse(email);

    if (!success) {
      setFlashMessage(c, "Invalid email address");
      return c.redirect("/");
    }

    await database
      .insert(newsletters)
      .values({
        email,
      })
      .onConflictDoNothing();

    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: env.RESEND_AUDIENCE_ID,
    });

    return c.redirect("/subscribed");
  });
}
