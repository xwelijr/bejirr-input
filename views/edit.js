<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Add your HTML head content here -->
</head>
<body>
    <div class="container">
        <h1><%= title %></h1>
        <h3>Edit Member</h3>
        <form action="/edit/<%= user.id %>" method="POST">
            <div class="row mb-3">
                <label for="Nama" class="col-sm-2 col-form-label">Nama Lengkap</label>
                <div class="col-sm-10">
                    <input type="text" name="Nama" class="form-control" value="<%= user.Nama %>" required>
                </div>
            </div>
            <div class="row mb-3">
                <label for="Kelas" class="col-sm-2 col-form-label">Kelas</label>
                <div class="col-sm-10">
                    <input type="text" name="Kelas" class="form-control" value="<%= user.Kelas %>" required>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <input type="submit" class="btn btn-primary btn-sm" value="Save Changes">
            </div>
        </form>
    </div>
</body>
</html>
