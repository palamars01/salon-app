export const guides: {
  title: string;
  overview: string;
  keyTasks: string[];
  video: string | null;
  tip?: string;
}[] = [
  {
    title: 'Understanding the Queue Management Dashboard:',
    overview:
      'Learn how to view and manage the queue, customer details, and real-time updates.',
    keyTasks: [
      'Viewing customer positions and estimated wait times.',

      'Adjusting wait times based on customer status.',
      'How to check in customers and manage their status.',
    ],
    video: null,
  },

  {
    title: 'Managing Customer Arrivals:',
    overview:
      ' Learn how to mark customers as "Arrived" when they check in and how to handle missed arrivals.',
    keyTasks: [
      'Check-in customers manually.',
      'Automatically update the queue when customers arrive.',
      'Mark a customer as "Missed" if they fail to check in.',
    ],
    video: null,
    tip: 'Ensure you use the "Missed Customer Alert" if the customer doesn’t arrive on time, to keep the queue running smoothly.',
  },

  {
    title: 'Adjusting Wait Times:',
    overview:
      ' Learn how to adjust wait times manually if there are changes in the queue dynamics.',
    keyTasks: [
      'Modify estimated wait times based on staff availability or customer flow.',
      'Update the queue summary panel for accurate reporting.',
    ],
    video: null,
    tip: ' Always communicate wait time changes to customers to manage expectations.',
  },
  {
    title: 'Using the Arrival Confirmation:',
    overview:
      'Learn how to confirm customer arrivals and update queue positions automatically.',
    video: null,
    keyTasks: [
      'Confirm customer check-ins and adjust their status.',

      'Handle missed customer alerts and follow up accordingly.',
    ],
    tip: ' If a customer is not checked in within the set time, act quickly to avoid delays in the queue.',
  },
];
