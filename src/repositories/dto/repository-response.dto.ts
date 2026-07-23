import { ApiProperty } from '@nestjs/swagger';

export class RepositoryResponseDto {
  @ApiProperty({ description: 'Unique Repository ID (UUID)', example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab' })
  id!: string;

  @ApiProperty({ description: 'Original file name', example: 'my-project.zip' })
  name!: string;

  @ApiProperty({ description: 'Extraction status', example: 'EXTRACTED' })
  status!: string;

  @ApiProperty({ description: 'Storage directory path', example: '/path/to/storage/repositories/uuid' })
  storagePath!: string | null;

  @ApiProperty({ description: 'File size in bytes', example: 1048576 })
  sizeBytes!: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
