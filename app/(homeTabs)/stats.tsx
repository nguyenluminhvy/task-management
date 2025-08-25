import React, {useMemo, useState} from "react";
import {View, Dimensions, ScrollView} from "react-native";
import { PieChart } from "react-native-chart-kit";
import {useTasks} from "@/lib/hooks/useTasks";
import {TaskStatus} from "@/lib/constants/task";
import moment from "moment";
import {Card, ProgressBar, Button, Avatar, Text, Title} from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen(props: any) {
  const [currentMonth, setCurrentMonth] = useState(moment());

  console.log({
    range: {
      start: currentMonth.startOf('month').toDate(),
      end: currentMonth.startOf('month').toDate(),
    }
  }, 'range')

  const { tasks } = useTasks({
    range: {
      start: currentMonth.startOf('month').toDate(),
      end: currentMonth.endOf('month').toDate(),
    }
  })

  console.log('tasks', tasks)

  const stats = useMemo(() => {
    const total = tasks.length;
    const counts = {
      [TaskStatus.Todo]: tasks.filter((t) => t.status === TaskStatus.Todo).length,
      [TaskStatus.InProgress]: tasks.filter((t) => t.status === TaskStatus.InProgress).length,
      [TaskStatus.Completed]: tasks.filter((t) => t.status === TaskStatus.Completed).length,
    };
    return { total, counts };
  }, [tasks]);

  const chartData = [
    {
      name: 'To do',
      count: stats.counts[TaskStatus.Todo],
      color: '#006EE9',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'In Progress',
      count: stats.counts[TaskStatus.InProgress],
      color: '#F59E0B',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Completed',
      count: stats.counts[TaskStatus.Completed],
      color: '#10B981',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 }}>

      <Text variant="titleLarge" style={{ marginBottom: 0, fontWeight: 'bold' }}>
        Task Statistics ({currentMonth.format('MMM YYYY')})
      </Text>

      {/* Chart */}
      <PieChart
        data={chartData.map((c) => ({
          name: c.name,
          population: c.count,
          color: c.color,
          legendFontColor: c.legendFontColor,
          legendFontSize: c.legendFontSize,
        }))}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />

      <Card style={{ marginTop: 16, borderRadius: 16 }}>
        <Card.Title
          title="To do"
          left={(props) => <Avatar.Icon {...props} icon="clipboard-list" color="white" style={{ backgroundColor: '#006EE9' }} />}
        />
        <Card.Content>
          <Text>{stats.counts[TaskStatus.Todo]} Tasks</Text>
          <ProgressBar progress={stats.counts[TaskStatus.Todo] / stats.total} color="#006EE9" style={{ marginTop: 8 }} />
        </Card.Content>
      </Card>


      <Card style={{ marginTop: 16, borderRadius: 16 }}>
        <Card.Title
          title="In Progress"
          left={(props) => <Avatar.Icon {...props} icon="progress-clock" color="white" style={{ backgroundColor: '#F59E0B' }} />}
        />
        <Card.Content>
          <Text>{stats.counts[TaskStatus.InProgress]} Tasks</Text>
          <ProgressBar progress={stats.counts[TaskStatus.InProgress] / stats.total} color="#F59E0B" style={{ marginTop: 8 }} />
        </Card.Content>
      </Card>


      <Card style={{ marginTop: 16, borderRadius: 16 }}>
        <Card.Title
          title="Completed"
          left={(props) => <Avatar.Icon {...props} icon="check-circle" color="white" style={{ backgroundColor: '#10B981' }} />}
        />
        <Card.Content>
          <Text>{stats.counts[TaskStatus.Completed]} Tasks</Text>
          <ProgressBar progress={stats.counts[TaskStatus.Completed] / stats.total} color="#10B981" style={{ marginTop: 8 }} />
        </Card.Content>
      </Card>


      {/* Filter buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
        <Button mode="outlined" onPress={() => setCurrentMonth(moment(currentMonth).subtract(1, 'month'))}>
          Prev
        </Button>
        <Button mode="outlined" onPress={() => setCurrentMonth(moment(currentMonth).add(1, 'month'))}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
}
