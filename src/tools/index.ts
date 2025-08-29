import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export function registerWebAutomationTools(): Tool[] {
  return [
    {
      name: 'navigate',
      description: 'Navigate to a specific URL in the browser',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL to navigate to',
          },
        },
        required: ['url'],
      },
    },
    {
      name: 'click',
      description: 'Click on an element specified by a CSS selector',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector for the element to click',
          },
        },
        required: ['selector'],
      },
    },
    {
      name: 'type',
      description: 'Type text into an input field specified by a CSS selector',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector for the input element',
          },
          text: {
            type: 'string',
            description: 'Text to type into the element',
          },
        },
        required: ['selector', 'text'],
      },
    },
    {
      name: 'screenshot',
      description: 'Take a screenshot of the current page',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_text',
      description: 'Get the text content of an element specified by a CSS selector',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector for the element to get text from',
          },
        },
        required: ['selector'],
      },
    },
    {
      name: 'wait_for_element',
      description: 'Wait for an element to become visible on the page',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector for the element to wait for',
          },
          timeout: {
            type: 'number',
            description: 'Maximum time to wait in milliseconds (default: 30000)',
          },
        },
        required: ['selector'],
      },
    },
    {
      name: 'fill_form',
      description: 'Fill multiple form fields at once',
      inputSchema: {
        type: 'object',
        properties: {
          fields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the form field',
                },
                value: {
                  type: 'string',
                  description: 'Value to enter in the field',
                },
              },
              required: ['selector', 'value'],
            },
            description: 'Array of form fields to fill',
          },
        },
        required: ['fields'],
      },
    },
    {
      name: 'select_option',
      description: 'Select an option from a dropdown menu',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector for the select element',
          },
          value: {
            type: 'string',
            description: 'Value or text of the option to select',
          },
        },
        required: ['selector', 'value'],
      },
    },
    {
      name: 'hover',
      description: 'Hover over an element specified by a CSS selector',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector for the element to hover over',
          },
        },
        required: ['selector'],
      },
    },
    {
      name: 'scroll_to',
      description: 'Scroll to an element or specific coordinates',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description:
              'CSS selector for the element to scroll to (optional if using coordinates)',
          },
          x: {
            type: 'number',
            description: 'X coordinate to scroll to',
          },
          y: {
            type: 'number',
            description: 'Y coordinate to scroll to',
          },
        },
      },
    },
    {
      name: 'get_page_title',
      description: 'Get the title of the current page',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_current_url',
      description: 'Get the current URL of the page',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'refresh_page',
      description: 'Refresh the current page',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'go_back',
      description: 'Navigate back to the previous page',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'go_forward',
      description: 'Navigate forward to the next page',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];
}
