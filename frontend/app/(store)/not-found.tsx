import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <p className="font-script text-6xl text-rose">Oops</p>
      <h1 className="section-title mt-4">This piece has found a new home</h1>
      <Link href="/shop" className="btn-primary mt-8">Explore other pieces</Link>
    </section>
  );
}
