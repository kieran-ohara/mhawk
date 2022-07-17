import Link from 'next/link';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LabelIcon from '@mui/icons-material/Label';

import useTags from '../hooks/tags';

function TagsLinks() {
  const { tags, isLoading } = useTags();

  if (isLoading) {
    return <></>;
  }

  return (
    <div>
      {tags.map((value) => {
        return (
          <Link href={`/tag/${value.slug}`} key={value.slug}>
            <ListItem button>
              <ListItemIcon><LabelIcon /></ListItemIcon>
              <ListItemText primary={value.name} />
            </ListItem>
          </Link>
        );
      })}
    </div>
  );
}

export default TagsLinks;
