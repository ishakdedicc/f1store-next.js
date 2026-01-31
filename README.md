This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# E-COMMERCE (F1 – Store)

## Projekat iz predmeta Napredne tehnike internet programiranja

## OPIS PROJEKTA

U okviru ovog projekta razvijena je e-commerce web aplikacija korištenjem **Next.js** frameworka baziranog na **React** biblioteci, uz primjenu **TypeScript** jezika. Aplikacija koristi **SQLite** bazu podataka, dok je za rad sa bazom implementiran **Prisma ORM**. Autentikacija i autorizacija korisnika realizovana je pomoću **NextAuth** biblioteke, uključujući podršku za klasičnu prijavu i **Google OAuth** autentikaciju.

Korisničke forme implementirane su korištenjem **React Hook Form**, dok je validacija podataka izvršena pomoću **Zod** biblioteke. Korisnički interfejs izrađen je uz pomoć **shadcn/ui** komponenti. Aplikacija podržava svijetli i tamni način prikaza, dok je **ESLint** korišten za održavanje kvaliteta i konzistentnosti koda.

Sistem plaćanja uključuje integraciju sa **Stripe API-jem** i **PayPal** servisom, uz korištenje sandbox/test okruženja i webhook mehanizama za obradu statusa transakcija, kao i opciju plaćanja pouzećem. Administratorski dio aplikacije omogućava upravljanje proizvodima, narudžbama i korisnicima, te prikaz statističkih podataka o prodaji uz grafički prikaz.

Za upload i upravljanje slikama proizvoda korišten je **Uploadthing** servis. Implementiran je sistem ocjena i recenzija proizvoda, kao i funkcionalnosti pretrage, sortiranja, filtriranja i paginacije. Nakon uspješno završene kupovine, korisnicima se automatski šalje račun putem emaila korištenjem **Resend API** servisa.

---

## OPIS APLIKACIJE

### Registracija korisnika

Na stranici za registraciju korisnicima je omogućeno kreiranje naloga putem klasične forme za unos osnovnih podataka ili korištenjem Google naloga. Implementirana Google OAuth autentikacija omogućava brzu i sigurnu registraciju bez potrebe za dodatnim unosom podataka.

![Registracija](./screenshots/register.png)

---

### Prijava korisnika

Stranica za prijavu omogućava korisnicima pristup aplikaciji putem unosa postojećih korisničkih podataka ili korištenjem Google naloga. Google OAuth autentikacija omogućava brz i siguran način prijave uz zadržavanje visokog nivoa sigurnosti.

![Prijava](./screenshots/login.png)

---

### Početna stranica

Početna stranica aplikacije predstavlja glavni pregled F1 Store platforme. Prikazani su najnovije dodani artikli, kao i sekcija _Deal of the Month_ sa promotivnim ponudama. Navigacijski meni omogućava jednostavan pristup svim dijelovima aplikacije.

## ![PocetnaStranica](./screenshots/homepage.png)

### Promjena teme

Aplikacija omogućava promjenu teme između svijetlog i tamnog načina prikaza, uz prilagođavanje korisničkim ili sistemskim postavkama.

![Tema](./screenshots/modetoogle.png)

---

### Pregled proizvoda

Aplikacija sadrži stranicu sa pregledom svih dostupnih proizvoda. Omogućeno je filtriranje proizvoda prema kategoriji, rasponu cijena i korisničkim ocjenama.

## ![SviProizvodi](./screenshots/allproducts.png)

### Detalji proizvoda

Klikom na proizvod otvara se stranica sa detaljima, uključujući slike, cijenu, opis i korisničke recenzije. Omogućeno je dodavanje proizvoda u korpu, uz jasan prikaz dostupnosti na stanju.
![Proizvod](./screenshots/product.png)

---

### Korpa

Nakon dodavanja artikla u korpu, korisniku se prikazuje potvrda. U korpi je vidljiv pregled artikala, količina i ukupna cijena, uz mogućnost prelaska na checkout proces.
![Korpa](./screenshots/cart.png)

---

### Checkout – dostava

Za započinjanje kupovine korisnik mora biti prijavljen. Na checkout stranici unose se podaci za dostavu, uključujući ime, adresu, grad, državu i poštanski broj.
![Adresa](./screenshots/address.png)

---

### Checkout – plaćanje

Korisnik bira metodu plaćanja. Podržano je plaćanje putem **PayPal**, **Stripe** servisa, kao i opcija plaćanja pouzećem.
![Placanje](./screenshots/method.png)

---

### Pregled narudžbe

Prije potvrde kupovine korisniku je prikazan pregled narudžbe sa adresom, metodom plaćanja, artiklima i ukupnom cijenom, uključujući porez i troškove dostave.
![Pregled](./screenshots/placeorder.png)

---

### Status narudžbe

Nakon potvrde narudžbe prikazan je status plaćanja i dostave. Omogućeno je online plaćanje putem PayPal dugmeta.
![Status](./screenshots/status.png)
![Paypal](./screenshots/paypal.png)

---

### Stripe plaćanje

Stripe je integrisan korištenjem Stripe Checkout i webhook mehanizama. Nakon uspješne transakcije status narudžbe se automatski ažurira.
![Stripe](./screenshots/stripe.png)

---

### Recenzije proizvoda

Registrovani korisnici mogu ostavljati ocjene i komentare na proizvode.
![Recenzija](./screenshots/review.png)

---

### Email potvrda

Nakon završene kupovine sistem automatski šalje račun korisniku putem emaila.
![Email](./screenshots/email.png)

---

### Korisnički profil

Registrovani korisnici mogu ažurirati podatke na svom profilu.
![Profil](./screenshots/profile.png)

---

### Historija narudžbi

Korisnicima je dostupna stranica sa historijom narudžbi, uključujući detalje o plaćanju i dostavi.
![Narudzbe](./screenshots/orders.png)

---

## ADMIN PANEL

### Pregled sistema

Admin panel sadrži pregled statističkih podataka, uključujući ukupan prihod, broj prodaja, korisnika i proizvoda, kao i graf prodaje i listu posljednjih narudžbi.
![Dashboard](./screenshots/dashboard.png)

---

### Upravljanje proizvodima

Administrator može pregledati, dodavati, uređivati i brisati proizvode.
![Proizvodi](./screenshots/adminproducts.png)

---

### Dodavanje proizvoda

Administrator unosi naziv proizvoda, generiše slug, odabire kategoriju i brend, definiše cijenu i stanje na skladištu, uploaduje slike i dodaje opis.
![DodavanjeProizvoda](./screenshots/addProducts.png)

---

### Upravljanje narudžbama

Administrator ima pregled svih narudžbi sa informacijama o kupcu, cijeni, plaćanju i statusu dostave.
![Narudzbe](./screenshots/adminOrders.png)

---

### Detalji narudžbe

Omogućeno je označavanje narudžbe kao dostavljene ili nedostavljene.
![Detalji](./screenshots/shipping.png)

---

### Upravljanje korisnicima

Administrator ima pregled svih korisnika, uključujući ime, email i korisničku rolu.
![Korisnici](./screenshots/users.png)
