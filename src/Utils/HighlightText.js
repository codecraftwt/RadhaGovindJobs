import { Text } from 'react-native';

const HighlightText = (text, query) => {
  if (!query) {
    return <Text>{text}</Text>;
  }
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <Text key={index} style={{ backgroundColor: 'yellow' }}>
        {part}
      </Text>
    ) : (
      <Text key={index}>{part}</Text>
    )
  );
};

export default HighlightText;