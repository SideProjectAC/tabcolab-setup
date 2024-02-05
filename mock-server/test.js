const newGroup = {
  id: "dbf4",
  name: "New Group",
};

fetch("http://3.115.208.60:4000/groups", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newGroup),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const updatedGroup = {
  id: "dbf4",
  name: "Updated Group",
};

fetch("http://3.115.208.60:4000/groups/dbf4", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updatedGroup),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
