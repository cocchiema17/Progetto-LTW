<template>
  <main>
    <Navbar />

    <div id="chiSiamo" class="bg-success">
      <img src="@/assets/finager-titolo.png" id="titolo" />
    </div>

    <p style="color: white">
      Finager &egrave; un applicazione web che ti permette di gestire e
      memorizzare le tue finanze attraverso l'inserimento delle tue transazioni
      e dei fantastici grafici.
      <br />
      Fai click su Sign up o su Sign in, in alto a destra, per accedere alla tua
      area personale.
    </p>

    <div id="funzionalita">
      <h2><strong> Funzionalit&agrave; </strong></h2>
      <div>
        <div class="text-image-conteiner">
          <div
            class="div-image"
            style="background-image: url('@/assets/tableHeader.png');"
          ></div>
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

    <Footer />
  </main>
</template>

<script>
import { mapGetters } from "vuex";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default {
  name: "IntroPage",
  components: { Navbar, Footer },
  computed: {
    ...mapGetters(["user"]),
  },
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
  background-color: #0d6efd;
  font-size: large;
  padding: 0 10px;
  margin: 0;
  filter: drop-shadow(0px 4px 10px #0d6efd);
}

strong {
  color: #0d6efd;
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

a {
  color: #0d6efd;
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
  color: #0d6efd;
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
  /* background-image: url("@/assets/logo.png"); */
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
    /* background-image: url("@/assets/logo.png"); */
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
