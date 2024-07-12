const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ReplicacheExpressServer } = require('replicache-express-server');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const replicache = new ReplicacheExpressServer({
  mutators: {
    addTodo: async (tx, { id, text }) => {
      await tx.put(id, { text, completed: false });
    },
    updateTodo: async (tx, { id, text }) => {
      const todo = await tx.get(id);
      if (todo) {
        todo.text = text;
        await tx.put(id, todo);
      }
    },
    deleteTodo: async (tx, { id }) => {
      await tx.del(id);
    },
    completeTodo: async (tx, { id, completed }) => {
      const todo = await tx.get(id);
      if (todo) {
        todo.completed = completed;
        await tx.put(id, todo);
      }
    },
  },
});

app.use('/replicache', replicache.expressMiddleware());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
