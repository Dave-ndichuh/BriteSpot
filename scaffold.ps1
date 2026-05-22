cd apps
npx.cmd create-next-app@latest dashboard --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
npx.cmd create-next-app@latest admin-panel --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
npx.cmd create-next-app@latest captive-portal --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd ..\services
npx.cmd @nestjs/cli new auth-service --package-manager npm --strict --skip-git --skip-install
npx.cmd @nestjs/cli new router-service --package-manager npm --strict --skip-git --skip-install
npx.cmd @nestjs/cli new mpesa-service --package-manager npm --strict --skip-git --skip-install
npx.cmd @nestjs/cli new billing-service --package-manager npm --strict --skip-git --skip-install
