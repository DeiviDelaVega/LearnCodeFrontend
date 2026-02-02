export interface AdminCourseDto {
  id: string;            
  title: string;
  subtitle: string;
  description: string;
  iconUrl: string;
  coverUrl: string;
  isFree: boolean;
  requiredPlanCode: string;
  isPublished: boolean;
  createdAt: string;        
}
