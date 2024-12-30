import { LiveMap, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Initialize Liveblocks client with your public API key and additional configurations
const client = createClient({
  throttle: 16,
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
  // Move resolveUsers to createClient
  async resolveUsers({ userIds }) {
    // Fetch user data from an external source (example, from a database)
    const usersData = await fetchUsersFromDatabase(userIds);
    
    // Map each user data to return name and avatar (assuming avatar is a URL or string)
    return usersData.map((userData) => ({
      name: userData.name,
      avatar: userData.avatar, // If avatar is a string (URL), use it directly
    }));
  },

  // Resolve mention suggestions for comments based on text input
  async resolveMentionSuggestions({ text, roomId }) {
    // Fetch user IDs from your database (example)
    const userIds = await fetchAllUserIdsFromDB(roomId);

    // If no text is provided, return all user IDs
    if (!text) {
      return userIds;
    }

    // Otherwise, filter user IDs based on the search `text`
    return userIds.filter((userId) =>
      userId.toLowerCase().includes(text.toLowerCase())
    );
  },
});

// Define the types for the presence, storage, user metadata, room events, and thread metadata

// Presence represents the properties that exist on every user in the Room
type Presence = {
  // Example: cursor tracking (uncomment and update as needed)
  // cursor: { x: number, y: number } | null,
};

// Storage represents the shared document that persists in the Room
type Storage = {
  // Example: canvas objects in LiveMap
  canvasObjects: LiveMap<string, any>;
};

// UserMeta represents static/readonly metadata for each user
type UserMeta = {
  // Example: user ID or other static info
  // id?: string,  // Accessible through `user.id`
  // info?: Json,  // Accessible through `user.info`
};

// RoomEvent represents custom events broadcast and listened to in the room
type RoomEvent = {
  // Example: custom event type
  // type: "NOTIFICATION",
};

// ThreadMetadata represents metadata on each thread (for comments)
export type ThreadMetadata = {
  resolved: boolean;
  zIndex: number;
  time?: number;
  x: number;
  y: number;
};

// Create the room context with the necessary types and configuration
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);

// Example function to simulate fetching user data from a database or external source
async function fetchUsersFromDatabase(userIds: string[]) {
  // Placeholder example - in a real scenario, replace with actual DB/API call
  return userIds.map((userId) => ({
    name: `User ${userId}`,
    avatar: `https://example.com/avatars/${userId}.jpg`, // Example avatar URL
  }));
}

// Example function to simulate fetching all user IDs for a room from the database
async function fetchAllUserIdsFromDB(roomId: string) {
  // Placeholder example - in a real scenario, replace with actual DB/API call
  return ["user1", "user2", "user3"];
}
