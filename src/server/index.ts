import express from 'express';
import { supervisorGraph } from '../graph';
import { setSSEHeaders } from '../middleware/headers';

const app = express();
const PORT = 3005;

// SSE endpoint
app.post('/task', express.json(), setSSEHeaders, async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    res.write(`data: ${JSON.stringify({ message: 'Connected to task processing' })}\n\n`);

    const generator = supervisorGraph.run(task);
    for await (const currentState of generator) {
      const parentKey = Object.keys(currentState)[0];
      const content = currentState[parentKey]?.messages?.[0]?.content;

      res.write(`data: ${JSON.stringify({ workInProgress: content })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ message: 'Task processing complete' })}\n\n`);
    res.end();

  } catch (error) {
    const errorRes = JSON.stringify(error, null, 2) || 'Internal server error';

    res.write(`data: ${JSON.stringify({ error: errorRes })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
