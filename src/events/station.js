// The racks we get after we've logged into a station
function stationLoginDone(context, payload) {
  const { racks } = payload;
  context.setState({ racks });
}

// Whenever a rack of a station gets updated
function stationRack(context, payload) {
  const { team, rack } = payload;
  const { racks } = context.getState();

  if (racks) {
    racks[team] = rack;
    context.setState({ racks });
  }
}

export default {
  'station:login:done': stationLoginDone,
  'station:rack': stationRack,
};
