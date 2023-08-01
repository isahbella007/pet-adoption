const sanitizePublicId = (cloudinary_public_id: string) => { 
    const sanitizedPublicId = cloudinary_public_id
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^a-zA-Z0-9./_-]/g, '') // Remove characters not allowed by Cloudinary
    .slice(0, 255); // Trim to 255 characters

  return sanitizedPublicId;
}
export default sanitizePublicId