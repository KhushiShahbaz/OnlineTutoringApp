import { Apple, PlayCircle, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AppDownload() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border-none bg-foreground text-background shadow-xl">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-2xl font-bold">Download Our App</h3>
            <p className="mt-2 max-w-md text-background/70">
              Learn anywhere, anytime with our mobile app.
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-background/10 px-4 py-2.5">
              <PlayCircle className="h-6 w-6" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-background/60">GET IT ON</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/10 px-4 py-2.5">
              <Apple className="h-6 w-6" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-background/60">DOWNLOAD ON</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </div>
          </div>
          <Smartphone className="hidden h-16 w-16 text-background/20 lg:block" />
        </CardContent>
      </Card>
    </section>
  );
}
