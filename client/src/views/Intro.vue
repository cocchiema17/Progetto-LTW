<template>
  <main>
    <nav id="navbar" class="navbar body-tertiary border-bottom">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h3">Finager</span>

        <ul class="nav nav-pills nav-fill">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Sign in</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">Sign up</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div id="chiSiamo" class="bg-success">
      <img src="@/assets/finager-titolo.png" id="titolo" />
    </div>

    <p>
      breve descrizione del servizio che offre l'applicazione web. pi3ehfrp1g
      ihpigf3h1 npithp girn p 2i4ng pinvòkne vròq ngò2br rnònv ò34 ng5ò4k
      nefn3jb 54lbgjnrkl5n
    </p>

    <div id="funzionalita">
      <h2><strong> Funzionalit&agrave; </strong></h2>
      <div>
        <div class="text-image-conteiner">
          <div class="div-image"></div>
          <div class="text-element">
            <strong>Funzione 1</strong>
            <br />
            <br />
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </div>
        </div>
      </div>

      <element ref="ele-1"></element>

      <div>
        <div
          class="text-image-conteiner content hidden inverted"
          ref="content-1"
        >
          <div class="text-element">
            <strong>Funzione 2</strong>
            <br />
            <br />
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum. eap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </div>
          <div class="div-image"></div>
        </div>
      </div>

      <element ref="ele-2"></element>

      <div>
        <div class="text-image-conteiner content hidden" ref="content-2">
          <div class="div-image"></div>
          <div class="text-element">
            <strong>Funzione 3</strong>
            <br />
            <br />
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </div>
        </div>
      </div>

      <element ref="ele-3"></element>

      <div>
        <div
          class="text-image-conteiner content hidden inverted"
          ref="content-3"
        >
          <div class="text-element">
            <strong>Funzione 4</strong>
            <br />
            <br />
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum. eap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </div>
          <div class="div-image"></div>
        </div>
      </div>
    </div>

    <footer id="contatti">
      <h3>Contatti</h3>
      <h5>
        Indirizzo email: <a href="mailto:info@finager.com">info@finager.com</a>
      </h5>
      <h5>
        Numero di telefono: <a href="tel:+391234567891">+39 1234567891</a>
      </h5>
      <a
        href="https://www.instagram.com/"
        target="_blank"
        class="fa fa-instagram"
      ></a>
      <a
        href="https://it-it.facebook.com/"
        target="_blank"
        class="fa fa-facebook"
      ></a>
    </footer>
  </main>
</template>

<script>
export default {
  name: "IntroPage",
  mounted() {
    const contents = [
      this.$refs["content-1"],
      this.$refs["content-2"],
      this.$refs["content-3"],
    ];

    const eles = [
      this.$refs["ele-1"],
      this.$refs["ele-2"],
      this.$refs["ele-3"],
    ];

    console.log(this.$refs);

    console.log(contents);
    console.log(eles);

    window.addEventListener("scroll", function () {
      for (let i = 0; i < contents.length; i++) {
        console.log(eles[i]);
        const rect = eles[i].getBoundingClientRect();
        const elePosition = rect.top + window.scrollY - window.innerHeight / 2;

        if (window.pageYOffset > elePosition) {
          contents[i].classList.add("visible");
          contents[i].classList.remove("hidden");
        }
      }
    });
  },
};
</script>

<style scoped>
a.nav-link {
  color: black;
}

.nav-link {
  padding: 16px 8px;
}

#chiSiamo {
  padding: 0 10px;
  padding-top: 60px;
  background-image: url("@/assets/sfondo.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#titolo {
  background-color: black;
  padding: 10px;
  height: 200px;
  width: 300px;
}

p {
  background-color: #198754;
  font-size: large;
  padding: 0 10px;
  margin: 0;
  filter: drop-shadow(0px 4px 10px #198754);
}

strong {
  color: #198754;
}

#funzionalita {
  background-color: rgb(255, 255, 230);
  padding: 0 10px;
}

h2 {
  padding: 10px;
}

#logo {
  height: 30px;
  width: 30px;
  border-radius: 8px;
}

footer {
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #333;
  color: #fff;
  text-align: center;
  filter: drop-shadow(0px 1px 10px black);
  padding: 5px;
}

a {
  color: #198754;
}

.fa {
  padding: 15px;
  font-size: 20px;
  width: 10px;
  height: 10px;
  text-align: center;
  text-decoration: none;
  margin: 2px 2px;
  border-radius: 50%;
  color: #198754;
}

.fa:hover {
  opacity: 0.7;
}

.text-image-conteiner {
  display: flex;
  padding-bottom: 30px;
}

.text-image-conteiner > div:nth-child(2) {
  margin-left: 10px;
}

.text-image-conteiner > div {
  border-radius: 20px;
  width: calc(50% - 5px);
}

.div-image {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("@/assets/logo.png");
}

.text-element {
  padding: 10px;
}

/* ModalitÃ  mobile */
@media screen and (max-width: 740px) {
  .text-image-conteiner {
    flex-direction: column;
  }

  .div-image {
    height: 300px;
    background-image: url("@/assets/logo.png");
  }

  .text-image-conteiner > div {
    width: 100%;
  }

  .text-image-conteiner > div:nth-child(2) {
    margin-left: 0px;
    margin-top: 10px;
  }

  .text-image-conteiner.inverted > div:nth-child(2) {
    margin-left: 0px;
    margin-top: 0px;
    margin-bottom: 10px;
  }

  .text-image-conteiner.inverted {
    flex-direction: column-reverse;
  }
}

.hidden {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.visible {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
</style>