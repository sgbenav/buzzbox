'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Hive, Prisma } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Users } from 'lucide-react'

import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { normalizeSlug } from '@/lib/utils'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
  }, [])

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Hive & {
        _count: Prisma.HiveCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className='relative z-50 max-w-lg overflow-visible rounded-lg border'
    >
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className='border-none outline-none ring-0 focus:border-none focus:outline-none'
        placeholder='Search communities...'
      />

      {input.length > 0 && (
        <CommandList className='absolute inset-x-0 top-full rounded-b-md bg-card shadow'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Communities'>
              {queryResults?.map((hive) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/hive/${e}`)
                    router.refresh()
                  }}
                  key={hive.id}
                  value={hive.name}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/hive/${normalizeSlug(hive.name)}`}>hive/{hive.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  )
}

export default SearchBar
