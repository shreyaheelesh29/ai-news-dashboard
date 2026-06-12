const dateNode = document.querySelector("#today");

if (dateNode) {
  dateNode.textContent = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());
}
