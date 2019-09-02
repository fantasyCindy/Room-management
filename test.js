const arr = Array.from({ length: 20 }, (_, i) => ({
  day: `1-${i}`,
  type: i
}));

arr.forEach(item => {
  const id = item.day + item.type;
  document.getElementById(id).innerHTML = `<span class="customer"  data-name="${item.name}" data-type="${item.type}">${item.name}</span>`;
});

document.body.addEventListener("click", e => {
  if (e.target.classList.contains("customer")) {
    const { type, name } = e.target.dataset;
    console.log(">> type", type);
    console.log(">> name", name);
  }
});
