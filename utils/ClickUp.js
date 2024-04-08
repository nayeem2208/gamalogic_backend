import axios from "axios";

async function clickUp(errorName,errorDescription) {
  const query = new URLSearchParams({
    custom_task_ids: 'true',
    team_id: '123'
  }).toString();

  const listId = process.env.CLICKUP_LIST_ID;
  try {
    const response = await axios.post(
      `https://api.clickup.com/api/v2/list/${listId}/task?${query}`,
      {
        name: errorName,
        description: errorDescription,
        markdown_description: errorDescription,
        assignees: [process.env.CLICKUP_ASSIGNEE],
        watchers: [process.env.CLICKUP_ASSIGNEE],
        notify_all: true,
        parent: null,
        links_to: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.CLICKUP_AUTHORIZATION
        }
      }
    ); 
  } catch (error) {
    console.error('Error:', error);
  }
}

export default clickUp

