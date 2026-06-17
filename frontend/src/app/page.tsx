import Link from 'next/link';
import { CircleDot, GraduationCap, Cog, CalendarClock, Scissors, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: CircleDot,
    title: 'Kort Envanteri',
    description: 'Sert zemin, kil, çim ve kapalı kortlarınızı bölge bazında takip edin.',
  },
  {
    icon: GraduationCap,
    title: 'Ders Oturum Geliri',
    description: 'Günlük ders geliri, kordon hizmeti ve oturum kayıtlarını tek panelden izleyin.',
  },
  {
    icon: Cog,
    title: 'Top Makinesi Bakımı',
    description: 'Top besleme, motor ve sensör arızalarını öncelik sırasıyla yönetin.',
  },
  {
    icon: CalendarClock,
    title: 'Kort Bakım Planı',
    description: 'Yüzey bakımı, ağ direği kontrolü ve aydınlatma planlarını takip edin.',
  },
  {
    icon: Scissors,
    title: 'Kordon Siparişleri',
    description: 'Raket kordonlama siparişlerini tip, gerilim ve durum bazında yönetin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-navy text-chalk clay-nav-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-accent text-accent-foreground">
              <CircleDot className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl text-chalk">TenPulse</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-chalk/80 hover:bg-chalk/10 hover:text-chalk">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="clay-btn bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-court/10 via-background to-accent/5">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--court)) 0, hsl(var(--court)) 1px, transparent 1px, transparent 80px)',
          }} />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Tenis Tesisi Operasyon Yönetimi
            </p>
            <h1 className="font-display max-w-2xl text-4xl leading-tight text-primary md:text-5xl">
              Kortlarınızı, ders programınızı ve tesis gelirinizi tek platformda yönetin
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Bağımsız tenis kulüpleri için kort envanteri, ders oturum takibi,
              top makinesi bakımı, kort bakım planı, kordon siparişleri ve fiyat kademesi yönetimi.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="clay-btn">
                <Link href="/register">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Demo Hesabıyla Giriş</Link>
              </Button>
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Demo: demo@suncourtstennis.com / demo123456
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display mb-8 text-2xl text-primary">Özellikler</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="clay-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.5} />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
