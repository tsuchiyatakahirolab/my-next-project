//notion Clientを追加
import { Client } from '@notionhq/client';

const token = process.env.NOTION_TOKEN?.trim();
if (!token || !token.startsWith('ntn_')) {
  throw new Error('NOTION_TOKEN is missing or not an Internal Integration secret');
}

export const notion = new Client({ auth: token });

export const getDatabase = async (databaseId) => {
  if (!databaseId) throw new Error('databaseId is required');
  const res = await notion.databases.query({ database_id: databaseId });
  return res.results;
};


export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};
