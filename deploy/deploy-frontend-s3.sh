#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# POS System — S3 + CloudFront Deployment Script for Frontend
# Run this from your local machine (requires AWS CLI configured)
# ═══════════════════════════════════════════════════════════════

set -e

# ─── Configuration ───
S3_BUCKET="${S3_BUCKET:-pos-system-frontend}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
BACKEND_URL="${BACKEND_URL:-http://YOUR_EC2_IP:8080/api}"

echo "🚀 POS Frontend — S3 Deployment"
echo "================================="
echo "S3 Bucket:   $S3_BUCKET"
echo "Region:      $AWS_REGION"
echo "Backend URL: $BACKEND_URL"
echo ""

# ─── Step 1: Build frontend ───
echo "🏗️  Building frontend..."
cd react-frontend

# Set the production API URL
echo "VITE_API_URL=$BACKEND_URL" > .env.production
npm run build

echo "✅ Build complete!"

# ─── Step 2: Create S3 bucket (if not exists) ───
echo "📦 Creating S3 bucket..."
aws s3 mb s3://$S3_BUCKET --region $AWS_REGION 2>/dev/null || echo "Bucket already exists"

# ─── Step 3: Configure static website hosting ───
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$S3_BUCKET --index-document index.html --error-document index.html

# ─── Step 4: Set bucket policy for public read ───
echo "🔓 Setting bucket policy..."
cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET/*"
        }
    ]
}
EOF
aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file:///tmp/bucket-policy.json

# ─── Step 5: Upload files ───
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$S3_BUCKET/ --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

# Upload index.html without cache
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Website URL: http://$S3_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
echo ""
echo "📝 Next steps:"
echo "   1. Create a CloudFront distribution pointing to this S3 bucket"
echo "   2. Update CORS_ORIGINS on your backend EC2 to include the CloudFront URL"
echo "   3. (Optional) Add a custom domain with Route53 + ACM certificate"

cd ..
