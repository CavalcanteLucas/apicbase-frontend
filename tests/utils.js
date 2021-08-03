export let columnData = (column, rows) => {
  if (rows) {
    return rows.map((row) => {
      return row
        .findAll("td")
        .at(column)
        .text();
    });
  }
};
