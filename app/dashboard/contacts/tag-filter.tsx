import { FC } from "react"
import { MultiSelect } from "@/components/ui/multi-select"
import { useQuery } from '@tanstack/react-query'

interface Tag {
  id: string
  name: string
}

interface TagFilterProps {
  value: string[]
  onChange: (value: string[]) => void
}

export const TagFilter: FC<TagFilterProps> = ({ value, onChange }) => {
  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('/api/contacts/tags')
      const data = await response.json()
      return data.data
    }
  })

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={tags.map((tag: Tag) => ({
        label: tag.name,
        value: tag.id,
      }))}
      placeholder="Filter by tags..."
    />
  )
}
