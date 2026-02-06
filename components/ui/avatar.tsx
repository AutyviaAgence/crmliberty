import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        return (
            <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
                {src ? (
                    <img
                        ref={ref}
                        src={src}
                        alt={alt}
                        className="aspect-square h-full w-full object-cover"
                        {...props}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-surface text-text-muted">
                        {fallback || "??"}
                    </div>
                )}
            </div>
        )
    }
)
Avatar.displayName = "Avatar"

export { Avatar }
