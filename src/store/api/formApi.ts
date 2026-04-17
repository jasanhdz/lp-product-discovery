import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getDynamicFormSchema: builder.query<any, void>({
      query: () => 'api/mock/form.json',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response
        } else if (typeof response === 'object' && response !== null) {
          const arrayProperty = Object.values(response).find((val) => Array.isArray(val))
          if (arrayProperty) {
            return arrayProperty
          }
        }
        return []
      }
    })
  })
})

export const { useGetDynamicFormSchemaQuery } = formApi
