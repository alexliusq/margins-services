provider "aws" {
  region = "us-east-1"
}

module "aws_s3_uploads" {
  source = "./terraform-uploads/"

  bucket_prefix = "margins-me-uploads-dev"
}

module "aws_cognito_auth" {
  user_pool_name = "margins-me-user-pool-dev"
  email_configuration_source_arn = "arn:aws:ses:us-east-1:516851544810:identity/hello@margins.me"
  clients =  [
    {
      name = "test1"
      generate_secret = false
      explicit_auth_flows = ["ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
    }
  ]
  tags = {
    Environment = "test"
    Terraform = true
  }
}

output "s3_bucket_id" {
  value = "${module.aws_s3_uploads.this_s3_bucket_id}"
}

output "s3_bucket_arn" {
  value = "${module.aws_s3_uploads.this_s3_bucket_arn}"
}

output "s3_bucket_domain_name" {
  value = "${module.aws_s3_uploads.this_s3_bucket_bucket_domain_name}"
}