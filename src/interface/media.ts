export interface Pic {
  file_id: number;
  user_id: string;
  filename: string;
  filesize: string;
  title: string;
  description: string;
  media_type: string;
  mine_type: string;
  time_added: string;
  screenshot?: string;
  thumbnails?: string;
}

export interface SearchParam {
  title?: string;
  description?: string;
}

export interface TagParam {
  file_id: number;
  tag: string;
}

export interface UploadResponse {
  message: string;
  file_id: number;
}
