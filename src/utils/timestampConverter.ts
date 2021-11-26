import moment from "moment";
export default function timestampConverter(unixTimestamp: number): string {
  const array = moment(unixTimestamp).toArray(); // [2013, 1, 4, 14, 40, 16, 154];
  return moment([array[0], array[1], array[2], array[3], array[4]]).fromNow();
}
