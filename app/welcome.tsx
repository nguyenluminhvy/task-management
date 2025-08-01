import { Text, View } from "react-native";
import { useEffect, useState } from "react";

export default function Welcome() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [items, setItems] = useState<(typeof usersTable.$inferSelect)[] | null>(
    null,
  );

  // useEffect(() => {
  //   (async () => {
  //     await drizzleDb.delete(usersTable);
  //     await drizzleDb.insert(usersTable).values([
  //       {
  //         name: 'John',
  //         age: 30,
  //         email: 'john@example.com',
  //       },
  //     ]);
  //     const users = await drizzleDb.select().from(usersTable);
  //
  //     console.log(users, 'users')
  //
  //     setItems(users);
  //   })();
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        Edit app/index.tsx to edit this screen. hello world 12367899999
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        {items?.map((item) => <Text key={item.id}>{item.email}</Text>)}
      </View>
    </View>
  );
}
