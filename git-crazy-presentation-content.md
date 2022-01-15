<!-- to be merged into reveal / text / pug files! -->
# Let's Git Crazy
# #######################################################################

OUTLINE
=======
# FIND STUFF
## search commit messages
git show ":/jm3" (quoted regexes are valid)
## search the code itself
git grep "update"

# REMOTES
remote repositories
ssh format (@ = pushable)
https format (pull-able)

# The Red Pill ("OK let's drop together.")
# #######################################################################

# HOW GIT /REALLY/ WORKS BEHIND THE SCENES
Git: revision control for files
- (But there are no files in git.  (Let's let that sink in.)
Q. So what /is/ git?
A. "A content-addressable filesystem" ...huh? not helpful, bro.
 "Git is *A graph of pointers to patches*" - me

# Two Metaphors:
The Artist's Workshop, and
The Annotated Map.

# the Annotated Map.
Branches + tags are pins in the map of your commits.
As you commit changes, git makes a graph of pointers, composed of
Refs. Refs contain pointers to commits + parent pointers. There can
either be zero, one, or two parent pointers, depending on whether
a commit is the first commit, a normal commit, or a two-parent merge
commit.

# The Artist's Workshop
The Workbench: Caution - wet paint!
The Shelf: Paint is drying
The Wall: Finished work hung on display
[visual]

# Pointers & Patches
Git doesn't store -files- or really even -revisions-.
Git creates a network of patches from your work irrespective of
branching; branches + tags (refs) are just named pointers to different
nodes in the graph.

# Branches are tags that move.
"Checking out" branches is really just a construct.

Git's just hiding the other unreachable commits for you.
Branches in git don't inherently store structure. All the structure
is in the repository itself. You're surrounded by all branches at
all times.  (There is no spoon.)

# PATCHES
history of linux + apache
a patch only makes sense when *applied* to something; we call that the patch's base
not files
<!-- patching example --><code>
  git diff (di) > cool.patch
  ... (time passes)
  git apply cool.patch
  patch -p1 < cool.patch
</code>

# POINTERS
branches (& tags) are pointers to commits in the graph
HEAD is a pointer to a commit in the graph
pointers to commits in the graph are called Refs because they are references to SHAs
master, HEAD, your branches, and your tags are all named Refs
the file nature of refs: echo 66666 > .git/refs/heads/coolrefbro

# MERGE COMMITS vs REBASING
Merge commits from merges: generally good!
Merge commits from pulls: generally not good!

git rerere: Reuse recorded resolution of conflicted merges

Patches aka diffs: file changes (blobs)</p>
Pointers: refs, branches, tags</p>

<!-- list refs -->
<code class="fragment">
  # branches + tags are both refs
  git show-ref --head
</code>

# committing to a detached HEAD
"no big deal!"
`git co DECAFBAD`
# /me looks around, finds a bug, fixes it
echo FIX >> config.rb
git commit config.rb -m "COOL FIX"
git co master
# oh no, the commit is unreachable

<!-- ref mangling example -->
# lets make a ref!
echo 66666 > .git/refs/heads/breadcrumb
# but don't do this
# instead, use git's wrappers:
git update-ref refs/heads/master 66666
git symbolic-ref HEAD
git ls-tree 66666
Note: sometimes refs are packed
cat .git/packed-refs

# REBASING
what rebasing is: changing which patch a commit is applied to
why make merge commits when not needed?
pull vs rebase

# INTERACTIVE REBASE
* reorder commits (line editing)
* squash commits (fix up, squash)
* slice out a commit

# DANGLING BLOBS
where do commits go when they die?
branch, add a commit, note the SHA, now remove the branch
got co 66666
# blammo! just because we deleted the pointer to the commit, 
# it's not gone; it's just no longer pointed to.
things rot in the reflog for ~2 weeks before being gc'd

# TERMS REVIEW
master, head, ref, SHA, remote, rebase

# #######################################################################

# THANKS / The End
BY John Manoogian III / jm3
See you in the green screen

[1] http://marklodato.github.io/visual-git-guide/

# #######################################################################
# COMMAND REFERENCE

# commit partial patches; don't commit the whole work area
git add -p

# what's new; relative specs like: year, days, etc.
git diff "@{1 day ago}"
git diff "coolfeature@{1 week ago}"

# delete a local branch (-D forces delete on unmerged)
git branch -d oldbranch (or tag -d)

# delete remote branches/tags
git push origin :oldbranch
git push origin :refs/tags/12345

# searching
## search commit messages
git show :/jm3
git show :/\^Merge
## search the code itself
git grep update

# branches
git branch --merged (--no-merged)

# stashing
git stash save mycoolstash
git stash --keep-index
git stash list
git stash show (-p)
git stash drop  * zsh comple!
git stash apply * don’t drop
git stash clear # zap


#1 COMMON COMMANDS

CONSTANTLY USED
==============
add
ci (check in)
co (checkout)
diff
l (onelinelog)
mv
pull
push
rebase
rm
show

COMMON
======
clone
fetch
help
init
merge
reset
tag

RARE
====
fsck
gc
lost-found
ls-tree
show-ref
symbolic-ref
remote
prune

#2 SOLVING COMMON PROBLEMS / QUESTIONS

P. It's so much shit to type!
S. Install git-friendly! (you get this for free with my dotfiles project)

P. The commands are hard to remember! (or, the options are hard to remember)
S. Use zsh or bash with completion! (github.com/git/git/tree/master/contrib/completion)

P. Everyone talks about merge vs. rebase. What's a rebase? Who cares?
S. Rebasing alters patches in order to advance the branch pointer.

P. How do I include a project within another project?
S. Use git modules (or better, don't use git submodules)

P. I left something out of a commit that I should have included.
S. `git commit --amend`

# GIT HYGIENE
deleting tags + branches
how do you know if a branch has been merged?
using a global ignore file

# The Blue Pill: 
Living in pleasant illusion land, getting work done

# JUST ONE MORE COMMIT
amend a prior commit

# SAVE YOUR WORK
You probably already know `git stash [pop]`
Let's kick it up a notch
* name your stashes
* restore your working area


