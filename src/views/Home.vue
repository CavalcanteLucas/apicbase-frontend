<template>
  <div id="home">
    <div class="container">
      <div class="row" style="padding-top: 2rem;">
        <div class="col-10 mx-auto">
          <img alt="Beet logo" src="../assets/logo.png" />
          <h1>APICBASE</h1>
          <h2>
            Full-Stack Developer <br />
            challenge assignment
          </h2>
          <p>
            Welcome to this Application. <br />
            For more details, check out the
            <a
              href="https://github.com/cavalcantelucas/apicbase"
              target="_blank"
              rel="noopener"
              >GitHub code repo</a
            >
          </p>
          <p style="padding-top: 2rem;">
            Written by <em>Lucas Cavalcante</em>, 2021
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: {
    msg: String,
  },
};
</script>

<style scoped>
h1 {
  font-size: 3rem;
  font-weight: 600;
  margin-top: 3rem;
}
h2 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #9A224E;
}
img {
  border-radius: 50%;
  width: 300px;
  height: 300px;
  object-fit: cover;
  opacity: 0.85;
  object-position: 100% 0;
}
</style>
