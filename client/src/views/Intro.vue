<template>
  <main>
    <div class="container">
      <div id="chiSiamo">
        <img src="@/assets/finager-titolo.png" id="titolo" />
      </div>

      <p>
        Finager &egrave; un applicazione web che ti permette di gestire e
        memorizzare le tue finanze attraverso l'inserimento delle tue
        transazioni e dei fantastici grafici.
        <br />
        Fai click su Sign up o su Sign in, in alto a destra, per accedere alla
        tua area personale.
      </p>

      <div id="funzionalita">
        <h2><strong> Funzionalit&agrave; </strong></h2>
        <div>
          <div class="text-image-conteiner">
            <div
              class="div-image"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/space.png') + ')',
              }"
            ></div>

            <div class="text-element">
              <strong>Space</strong>
              <br />
              <br />
              Lo Space &egrave; il conto dove potrai inserire e monitorare le
              tue transazioni, che siano entrate o uscite.
              <br />
              Potrai creare i tuoi personali space per suddividere le
              transazioni in base alle tue esigenze.
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
              <strong>Categorie</strong>
              <br />
              <br />
              Sar&agrave; possibile inserire una categoria alle tue transazioni
              per poterle raggrupparle in base alle tue esigenze. Ad ogni
              categoria potrai associare un colore a tuo piacimento.
            </div>
            <div
              class="div-image"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/category.png') + ')',
              }"
            ></div>
          </div>
        </div>

        <element ref="ele-2"></element>

        <div>
          <div class="text-image-conteiner content hidden" ref="content-2">
            <div
              class="div-image"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/exampleTable.png') + ')',
              }"
            ></div>
            <div class="text-element">
              <strong>Transazioni</strong>
              <br />
              <br />
              Inserisci le tue transazioni all' interno per poterle memorizzare
              e visualizzare.
              <br />
              Nella tua home avrai accesso alla tabella che contiene tutte le
              tue transazioni.
              <br />
              Potrai gestire le tue transazioni: ordinandole in base ad una
              delle colonne della tabella, filtrarle in base ai dei criteri,
              modificarle ed eliminarle.
              <br />
              &Egrave; possibile scaricare un file excel con i dati delle tue
              transazioni.
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
              <strong>Grafici</strong>
              <br />
              <br />
              Nella tua home avrai tre tipi di grafici che rappresenteranno le
              transazioni memorizzate: il primo grafico &egrave; un grafico a
              colonna che rappresenta le tue entrate ed uscite, il
              secondo grafico &egrave; un grafico in linea ed infine il terzo
              grafico &egrave; a torta colorato in base alla categoria delle
              transazioni.
            </div>
            <div
              class="div-image"
              :style="{
                backgroundImage: 'url(' + require('@/assets/grafici.png') + ')',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </main>
</template>

<script>
import { mapGetters } from "vuex";

import Footer from "../components/Footer";
export default {
  name: "IntroPage",
  components: { Footer },
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
  margin-top: 30px;
  padding: 20px;
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
  color: white;
  font-size: large;
  padding: 0 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  filter: drop-shadow(0px 4px 3px #0d6efd);
}

strong {
  color: #0d6efd;
  font-size: larger;
}

#funzionalita {
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
  background-size: contain;
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
