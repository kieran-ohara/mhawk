import Link from 'next/link';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LabelIcon from '@material-ui/icons/Label';

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
