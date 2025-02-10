const MILLIS_PER_HOUR = 3600000;
const DAY_IN_MS = 86400000;

export const calculateAverageDeliveryTimeForPeriod = (orders, days) => {
  const now = new Date().getTime();
  const periodStart = now - days * DAY_IN_MS;
  const filteredOrders = orders.filter((order) => {
    const createdAt = new Date(order.created_at).getTime();
    return (
      createdAt >= periodStart &&
      createdAt <= now &&
      order.is_delivered === true
    );
  });

  return calculateAverageDeliveryTime(filteredOrders);
};

export const filterAndCalculateAverageDeliveryTime = (orders) => {
  const validOrders = orders.filter(
    (order) =>
      order.is_delivered === true &&
      new Date(order.delivered_at).getTime() !==
        new Date('1000-01-01T12:00:00').getTime()
  );
  return calculateAverageDeliveryTime(validOrders);
};

export const calculateAverageDeliveryTime = (orders) => {
  let totalMilliseconds = 0;
  let count = 0;

  orders.forEach((order) => {
    const createdAt = new Date(order.created_at).getTime();
    const deliveredAt = new Date(order.delivered_at).getTime();

    if (!isNaN(deliveredAt) && !isNaN(createdAt)) {
      totalMilliseconds += deliveredAt - createdAt;
      count++;
    }
  });

  if (count > 0) {
    const averageMilliseconds = totalMilliseconds / count;
    const hours = Math.floor(averageMilliseconds / MILLIS_PER_HOUR);
    const minutes = Math.floor((averageMilliseconds % MILLIS_PER_HOUR) / 60000);
    return `${hours}h ${minutes}m`;
  } else {
    return 'aucune donnée';
  }
};

export const getDeliveryTime = (order) => {
  try {
    const createdAt = new Date(order.created_at);
    const deliveredAt = new Date(order.delivered_at);

    if (!isNaN(deliveredAt.getTime()) && !isNaN(createdAt.getTime())) {
      const deliveryMilliseconds = deliveredAt.getTime() - createdAt.getTime();
      const deliveryHours = Math.floor(deliveryMilliseconds / MILLIS_PER_HOUR);
      const deliveryMinutes = Math.floor(
        (deliveryMilliseconds % MILLIS_PER_HOUR) / 60000
      );

      let result = '';
      if (deliveryHours > 0) {
        result += `${deliveryHours} ${
          deliveryHours === 1 ? 'heure' : 'heures'
        }`;
      }
      if (deliveryMinutes > 0) {
        if (result) {
          result += ' ';
        }
        result += `${deliveryMinutes} minutes`;
      }

      return result || 'En cours';
    }
  } catch (error) {
    console.error('Error processing individual order date:', error);
  }
  return 'N/A';
};
