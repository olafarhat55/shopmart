export interface ISubcategory {
  _id: string
  name: string
  slug: string
  category: string // parent category id
  createdAt?: string // ISO date string
  updatedAt?: string // ISO date string
}