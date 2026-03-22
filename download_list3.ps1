$links = @(
    @{ name = "admin_quotes"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdiODM4MzU1YzNjODRjYzE4N2NlNjMzMzBmZmFkOTlhEgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" },
    @{ name = "admin_quote_response"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzI0MjVmMGJlNWY2YjRkOWFhYmUwMTFkMWFkMTRiZGUwEgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" },
    @{ name = "admin_order_details"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhjN2ZmYjIyMjU2MjQwMjVhYjY4MWQ2YzZhNGM3MDM1EgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" },
    @{ name = "admin_add_brand"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZmM2E1ZWMxZDUzMTRmNzFiODFkZDE1YzMwN2I4NDUxEgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" },
    @{ name = "admin_orders"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VlMjcxZjg4Y2Q0ZTQ0ZDRiMTcyYzY3MDQxMjhjMzIxEgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" },
    @{ name = "admin_inventory"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzk3MGE2NDFkZjE3MDQ4N2RiZjhjOWVkMzc3MzNjMmUzEgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" },
    @{ name = "admin_brand_management"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAxMWRhMGU5Njg1ZjRjYjg5NzQ0ODJiZjEzNTJiMjg4EgsSBxDykKaeowQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA0ODQ5MzUxOTY1NDA3NDc1Mg&filename=&opi=89354086" }
)

foreach ($link in $links) {
    $dest = "stitch_screens/admin/$($link.name).html"
    Write-Host "Downloading $($link.name)..."
    curl.exe -L $link.url -o $dest
}
