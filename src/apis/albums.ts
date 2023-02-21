import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  ALBUMS_BASE: '/api/admin/photos/albums',
  PHOTO_BASE: '/api/admin/photos',
  ALBUMS_INFO: '/api/admin/photos/albums/info',
  PHOTO_DELETE: '/api/admin/photos/delete',
  PHOTO_MOVE: '/api/admin/photos/album'
}

export interface AlbumRequest {
  current: number
  size: number
  keywords?: string | null
}

export interface AlbumItem {
  id: number | null
  albumName: string
  albumDesc: string
  albumCover: string
  status?: number
  photoCount?: number
}

export interface AlbumResponse {
  code: number
  data: {
    count: number
    records: AlbumItem[]
  }
  flag?: boolean
  message: string
}

export interface AlbumDetailResponse {
  code: number
  data: AlbumItem
  flag?: boolean
  message: string
}

export interface PhotoItem {
  id: number | null
  photoName: string
  photoDesc: string | null
  photoSrc: string
}

export interface PhotoRequest {
  current: number
  size: number
  albumId?: number | null
  isDelete?: number
}

export interface PhotoResponse {
  code: number
  data: {
    count: number
    records: PhotoItem[]
  }
  flag?: boolean
  message: string
}

export interface PhotoSaveRequest {
  albumId: number | null
  photoUrls: string[]
}

export interface PhotoDeleteRequest {
  ids?: number[]
  isDelete?: number
}

export interface PhotoMoveRequest {
  albumId: number | null
  photoIds: number[]
}

export interface PhotoEditRequest {
  id: number | null
  photoName: string
  photoDesc: string | null
}

export const getAlbumsList = (param: AlbumRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.ALBUMS_BASE, { query: param, ...Header })
}

export const getAlbumsInfo = () => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.ALBUMS_INFO, Header)
}

export const getAlbumDetail = (id: number) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.ALBUMS_BASE + '/' + id + '/info', Header)
}

export const editAlbum = (param: AlbumItem) => {
  const Header = useUserStore().headerAuth
  return http.post(URLS.ALBUMS_BASE, { json: param, ...Header })
}

export const deleteAlbum = (id: number) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.ALBUMS_BASE + '/' + id, Header)
}

export const getPhotos = (param: PhotoRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.PHOTO_BASE, { query: param, ...Header })
}

export const savePhotoForAlbum = (param: PhotoSaveRequest) => {
  const Header = useUserStore().headerAuth
  return http.post(URLS.PHOTO_BASE, { json: param, ...Header })
}

export const deletePhotoFromAlbum = (param: PhotoDeleteRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.PHOTO_DELETE, { json: param, ...Header })
}

export const movePhoto = (param: PhotoMoveRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.PHOTO_MOVE, { json: param, ...Header })
}

export const deletePhotos = (param: number[]) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.PHOTO_BASE, { json: param, ...Header })
}

export const updatePhoto = (param: PhotoEditRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.PHOTO_BASE, { json: param, ...Header })
}
